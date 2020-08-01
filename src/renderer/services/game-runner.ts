import http, { IncomingMessage } from "http";
import path from "path";
import os from "os";
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

type ServerType = "Engine" | "Assets";

export class GameRunner {
  private static engineServer: http.Server;
  private static assetsServer: http.Server;
  private static desktopProcess: child_process.ChildProcess;

  static getRunningServerURL(serverType: ServerType) {
    const server =
      serverType === "Engine" ? this.engineServer : this.assetsServer;

    if (!server || !server.listening) {
      return "";
    }

    const address = server.address() as AddressInfo;
    return `http://${address.address}:${address.port}`;
  }

  static isWebServerRunning(serverType: ServerType) {
    if (serverType === "Engine") {
      return this.engineServer && this.engineServer.listening;
    }

    return this.assetsServer && this.assetsServer.listening;
  }

  static async close() {
    if (this.engineServer) {
      this.engineServer.close(() => {
        console.log(`Engine Server stopped.`);
      });
    }
    if (this.assetsServer) {
      this.assetsServer.close(() => {
        console.log(`Assets Server stopped.`);
      });
    }
  }

  private static async getAvalibleIPs() {
    var ifaces = os.networkInterfaces();
    if (!ifaces) {
      return [];
    }

    Object.keys(ifaces).forEach((ifname) => {
      if (!ifname) {
        return;
      }

      var alias = 0;

      ifaces[ifname]?.forEach(function (iface) {
        if ("IPv4" !== iface.family || iface.internal !== false) {
          return;
        }

        if (alias >= 1) {
          console.log(ifname + ":" + alias, iface.address);
        } else {
          console.log(ifname, iface.address);
        }
        ++alias;
      });
    });
  }

  static async runAsDesktop(project: AVGProjectData) {
    const engineBundleDir = BundlesManager.getLocalEngineDir(
      project.engineHash,
      EnginePlatform.Desktop
    );

    const electronExecutable = await BundlesManager.getElectronExecutable();
    if (!electronExecutable) {
      throw new Error("执行游戏客户端程序异常，请确认已安装桌面启动器支持。");
    }

    // 修改引擎配置文件
    const engineConfigFile = path.join(engineBundleDir, "engine.json");
    const engineConfig = fs.readJSONSync(engineConfigFile);

    engineConfig.game_assets_root = project.dir;
    fs.writeJsonSync(engineConfigFile, engineConfig);

    // 运行进程
    const entry = `${engineBundleDir}/main.electron.js`;
    console.log("electronExecutable", electronExecutable, entry);

    if (this.desktopProcess) {
      this.desktopProcess.kill();
    }

    this.desktopProcess = child_process.spawn(
      electronExecutable,
      [`${engineBundleDir}/main.electron.js`],
      {
        stdio: "inherit",
        windowsHide: false
      }
    );
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
      const assetsURL = `http://${assetsServerAddress.address}:${assetsServerAddress.port}`;
      this.engineServer = await this.serveEngine(project, assetsURL);
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

    return this.runServer(assetsDir, {
      cacheControl: false,
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    });
  }

  static async serveEngine(project: AVGProjectData, assetServerURL: string) {
    // 查找引擎 package
    const engineBundleDir = BundlesManager.getLocalEngineDir(
      project.engineHash,
      EnginePlatform.Browser
    );

    // 修改引擎配置文件
    const engineConfigFile = path.join(engineBundleDir, "engine.json");
    const engineConfig = fs.readJSONSync(engineConfigFile);

    engineConfig.game_assets_root = assetServerURL;
    fs.writeJsonSync(engineConfigFile, engineConfig);

    return this.runServer(engineBundleDir);
  }

  static async runServer(
    servePath: string,
    staticOptions?: serveStatic.ServeStaticOptions,
    hostname: string = "0.0.0.0",
    port: number = 0
  ) {
    if (!port) {
      port = await getPort({ port: getPort.makeRange(2333, 3000) });
    }

    const url = `http://${hostname}:${port}`;

    try {
      return await new Promise<http.Server>((resolve, reject) => {
        const server = connect()
          .use(serveStatic(servePath, staticOptions))
          .listen(port, hostname, () => {
            logger.info(`Server started on ${url}, serving ${servePath} ...`);
            resolve(server);
          })
          .on("error", (error) => {
            reject(error.message);
          });
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
