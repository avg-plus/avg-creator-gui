import http from "http";
import path from "path";
import URL from "url";
import fs from "fs-extra";
import child_process from "child_process";

import { AVGProjectData } from "./../manager/project-manager";
import connect from "connect";
import serveStatic from "serve-static";
import getPort from "get-port";
import { BundlesManager } from "./bundles-manager/bundles-manager";

import { EnginePlatform } from "../../common/engine-platform";
import { logger } from "../../common/lib/logger";
import { AddressInfo } from "net";
import { shell } from "electron";
import PubSub from "pubsub-js";
import { SubcribeEvents } from "../../common/subcribe-events";
import { AVGScriptHotReload } from "./fs-watch";
import { DebugServer } from "../../main/debug-server/debug-server";

type ServerType = "Engine" | "Assets";

export class GameRunner {
  private static engineServer: http.Server;
  private static assetsServer: http.Server;
  static desktopProcess: child_process.ChildProcess;
  static desktopProcessStatus: "normal" | "closed" = "closed";

  static getRunningServerURL(serverType: ServerType) {
    const server =
      serverType === "Engine" ? this.engineServer : this.assetsServer;

    if (!server || !server.listening) {
      return "";
    }

    const addressInfo = server.address() as AddressInfo;
    let ip = addressInfo.address;
    if (ip === "0.0.0.0" || ip === "::") {
      ip = "127.0.0.1";
    } else if (ip.includes(":")) {
      ip = `[${ip}]`;
    }

    return `http://${ip}:${addressInfo.port}`;
  }

  static isWebServerRunning(serverType: ServerType) {
    if (serverType === "Engine") {
      return this.engineServer && this.engineServer.listening;
    }

    return this.assetsServer && this.assetsServer.listening;
  }

  static openInBrowser(URL: string) {
    shell.openExternal(URL);
  }

  static async close() {
    if (this.engineServer) {
      this.engineServer.close(() => {
        logger.debug(`Engine Server stopped.`);
      });
    }
    if (this.assetsServer) {
      this.assetsServer.close(() => {
        logger.debug(`Assets Server stopped.`);
      });
    }
  }

  static async runAsDesktop(project: AVGProjectData) {
    const engineBundleDir = BundlesManager.getLocalEngineDir(
      project.engineHash,
      EnginePlatform.Desktop
    );

    try {
      const electronExecutable = await BundlesManager.getElectronExecutable();
      if (!electronExecutable) {
        throw new Error("执行游戏客户端程序异常，请确认已安装桌面启动器支持。");
      }

      // 修改引擎配置文件
      const engineConfigFile = path.join(engineBundleDir, "engine.json");

      logger.debug("engineConfigFile", engineConfigFile);

      const engineConfig = fs.readJSONSync(engineConfigFile);

      engineConfig.game_assets_root = project.dir;
      fs.writeJsonSync(engineConfigFile, engineConfig);

      // 运行进程
      const entry = `${engineBundleDir}/main.electron.js`;
      logger.debug("electronExecutable", electronExecutable, entry);

      if (this.desktopProcess) {
        this.desktopProcess.kill();
      }

      this.desktopProcess = child_process.spawn(
        electronExecutable,
        [`${engineBundleDir}/main.electron.js`, `--debug=127.0.0.1:56100`],
        {
          stdio: "inherit",
          windowsHide: false
        }
      );

      if (this.desktopProcess) {
        this.desktopProcessStatus = "normal";
        PubSub.publish(SubcribeEvents.GameProcessChanged, {
          status: "normal"
        });

        this.desktopProcess.on("close", () => {
          this.desktopProcessStatus = "closed";
          PubSub.publish(SubcribeEvents.GameProcessChanged, {
            status: "closed"
          });
        });
        this.desktopProcess.on("exit", () => {
          this.desktopProcessStatus = "closed";
          PubSub.publish(SubcribeEvents.GameProcessChanged, {
            status: "closed"
          });
        });

        // 开始监听目录
        AVGScriptHotReload.watch(project.dir);

        return true;
      }
    } catch (error) {
      throw new Error(error);
    }

    return false;
  }

  static async serve(project: AVGProjectData) {
    await this.close();

    this.assetsServer = await this.serveAssets(project);
    const assetsServerAddress = this.assetsServer.address() as AddressInfo;
    if (
      this.assetsServer &&
      this.assetsServer.listening &&
      assetsServerAddress
    ) {
      this.engineServer = await this.serveEngine(
        project,
        assetsServerAddress.port
      );
    }

    // 如果引擎和资源服务有任意一个没启动，则清理
    if (!this.assetsServer || !this.engineServer) {
      this.assetsServer?.close();
      this.engineServer?.close();

      return false;
    }

    return true;
  }

  static async cleanServer() {
    this.assetsServer?.close();
    this.engineServer?.close();
  }

  static async serveAssets(project: AVGProjectData) {
    const assetsDir = project.dir;
    const { serveStatic, server } = await this.runServer();
    serveStatic(assetsDir, {
      cacheControl: false,
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    });
    return server;
  }

  static async serveEngine(project: AVGProjectData, assetPort: number) {
    // 查找引擎 package
    const engineBundleDir = BundlesManager.getLocalEngineDir(
      project.engineHash,
      EnginePlatform.Browser
    );

    // 修改引擎配置文件
    const engineConfigFile = path.join(engineBundleDir, "engine.json");
    const engineConfig = fs.readJSONSync(engineConfigFile);

    const { app, server, serveStatic } = await this.runServer();
    app.use(
      "/engine.json",
      (req: connect.IncomingMessage, res: http.ServerResponse) => {
        let url = `http://127.0.0.1:${assetPort}/`;
        const header = req.headers["referer"] || req.headers["host"] || "";
        if (header) {
          if (header.startsWith("http")) {
            // referer或者带http(s)://的host
            const u = URL.parse(header);
            url = `${u.protocol}//${u.hostname}:${assetPort}/`;
          } else {
            // 注意ipv6
            const host = header.split(":");
            host.pop();
            const schema = req.headers["HTTPS"] ? "https:" : "http:";
            url = `${schema}//${host.join(":")}:${assetPort}/`;
          }
        }
        res.end(
          JSON.stringify({
            ...engineConfig,
            game_assets_root: url
          })
        );
      }
    );

    serveStatic(engineBundleDir);
    return server;
  }

  static async runServer(port: number = 0) {
    if (!port) {
      port = await getPort({ port: getPort.makeRange(2333, 3000) });
    }

    const app = connect();

    const server = await new Promise<http.Server>((resolve, reject) => {
      const server = app
        .listen(port, () => {
          let host = (server.address() as AddressInfo).address || "";
          if (host.includes(":")) {
            host = `[${host}]`;
          }
          host += (server.address() as AddressInfo).port;
          logger.debug(`Server started on http://${host}`);
          resolve(server);
        })
        .on("error", (error) => {
          reject(error.message);
        });
      return server;
    });

    return {
      app,
      server,
      port,
      serveStatic(path: string, options?: serveStatic.ServeStaticOptions) {
        app.use(serveStatic(path, options));
        logger.debug(`\t\tserving ${path}...`);
        return this;
      }
    };
  }
}
