import http, { IncomingMessage } from "http";
import path from "path";
import fs from "fs-extra";

import { AVGProjectData } from "./../manager/project-manager";
import connect from "connect";
import serveStatic from "serve-static";
import getPort from "get-port";

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

  static async serve(project: AVGProjectData) {
    // 查找引擎 package
    const engineBundleDir =
      "/Users/angrypowman/Library/Application Support/avg.creator/avg-bundles/engines/.cache/AVGPlus-browser-v0.1.24_alpha";

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
    this.engineServer = connect()
      .use(serveStatic(engineBundleDir))
      .listen(enginePort, () => {
        console.log(`Engine Server started on ${engineURL}...`);
      });

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
      });
  }
}
