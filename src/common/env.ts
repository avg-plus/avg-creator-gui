import fs from "fs-extra";
import path from "path";

import { remote } from "electron";
import { Config } from "./config";
const app = remote.app;

export class Env {
  static appDataDir: string;
  static getAppDataDir() {
    return Env.appDataDir;
  }

  // 获取游戏模板工程目录
  static getAVGProjectTemplateDir() {
    return path.join(this.getAppDataDir(), "avg-bundles/project-templates");
  }

  // 获取游戏引擎包目录
  static getAVGEngineBundleDir() {
    return path.join(this.getAppDataDir(), "avg-bundles/engines");
  }

  // 获取工作目录
  static getWorkspace() {
    return Config.get("workspace");
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
