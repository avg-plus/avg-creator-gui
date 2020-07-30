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
import { remote } from "electron";
import AdmZip from "adm-zip";

export class GameRunner {
  private static engineServer: http.Server;
  private static assetsServer: http.Server;

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

  static async runAsDesktop() {
    const electronPath = path.join(
      __dirname,
      "../runners/darwin-x64/Electron.app/Contents/MacOS/Electron"
    );

    console.log("electronPath", electronPath);

    const getElectronPath = () => {
      if (fs.existsSync(electronPath)) {
        return electronPath;
      } else {
        throw new Error("执行游戏客户端程序异常。");
      }
    };

    var child = child_process.spawn(
      getElectronPath(),
      [
        "/private/var/folders/7g/v7z2nm295q3d224h570vyny40000gn/T/56920056c8866bc6cd1f3191fe211c33/bundle/main.electron.js"
      ],
      {
        stdio: "inherit",
        windowsHide: false
      }
    );
  }

  static async serve(project: AVGProjectData) {
    console.log("serve", project, this.getAvalibleIPs());
    const bundle = BundlesManager.getLocalBundleByHash(project.engineHash);
    if (!bundle) {
      throw "创建项目失败：无法读取模板项目";
    }

    // 查找引擎 package
    const engineTemp = path.join(remote.app.getPath("temp"), bundle.hash);
    fs.removeSync(engineTemp);

    const zip = new AdmZip(bundle.filename);
    zip.extractAllTo(engineTemp, true);

    console.log("engineTemp", engineTemp);

    const engineBundleDir = path.join(engineTemp, "bundle");
    const assetsDir = project.dir;

    await this.close();

    const enginePort = 2333; //await getPort({ port: getPort.makeRange(2333, 3000) });
    const assetsPort = 2336; //await getPort({ port: getPort.makeRange(3005, 3100) });

    const engineURL = `http://127.0.0.1:${enginePort}`;
    const assetsURL = `http://127.0.0.1:${assetsPort}`;

    // 修改引擎配置文件
    const engineConfigFile = path.join(engineBundleDir, "engine.json");
    const engineConfig = fs.readJSONSync(engineConfigFile);

    engineConfig.game_assets_root = assetsURL;
    fs.writeJsonSync(engineConfigFile, engineConfig);

    // 开启服务
    const p_Engine = new Promise<boolean>((resolve) => {
      this.engineServer = connect()
        .use(serveStatic(engineBundleDir))
        .listen(enginePort, () => {
          console.log(`Engine Server started on ${engineURL}...`);
          resolve(true);
        });
    });

    const p_Assets = new Promise<boolean>((resolve) => {
      this.assetsServer = connect()
        .use(
          serveStatic(assetsDir, {
            cacheControl: false,
            setHeaders: (res) => {
              res.setHeader("Access-Control-Allow-Origin", "*");
            }
          })
        )
        .listen(assetsPort, () => {
          console.log(`Assets Server started on ${assetsURL} `);
          resolve(true);
        });
    });

    return Promise.all([p_Engine, p_Assets]);
  }
}
