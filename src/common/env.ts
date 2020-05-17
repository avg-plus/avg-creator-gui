import nconf from "nconf";
import fs from "fs-extra";
import path from "path";

import { remote } from "electron";
const app = remote.app;

export class Env {
  static appDataDir: string;
  static getAppDataDir() {
    return Env.appDataDir;
  }

  static init() {
    app.setAppLogsPath();

    // 初始化数据目录
    const appData = app.getPath("appData");
    const appName = app.getName();
    this.appDataDir = path.join(appData, appName);
    fs.mkdirpSync(this.appDataDir);
  }
}
