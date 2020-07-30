import os from "os";
import fs from "fs-extra";
import path from "path";

import { remote } from "electron";
import { LocalAppConfig } from "./local-app-config";
const app = remote.app;

export class Env {
  static appDataDir: string;
  static getAppDataDir() {
    return Env.appDataDir;
  }

  static getOSName() {
    const platforms = {
      darwin: "MacOS",
      win32: "Windows"
    };

    return platforms[os.platform()];
  }

  // 获取游戏模板工程目录
  static getBundleDir() {
    return path.join(this.getAppDataDir(), "avg-bundles/");
  }

  // 获取游戏模板工程目录
  static getAVGProjectTemplateDir() {
    return path.join(this.getBundleDir(), "project-templates");
  }

  // 获取游戏引擎包目录
  static getAVGEngineBundleDir() {
    return path.join(this.getBundleDir(), "engines");
  }

  // 获取Electron镜像目录
  static getElectronMirrorBundleDir() {
    return path.join(this.getBundleDir(), "electron-mirrors");
  }

  // 获取工作目录
  static getWorkspace() {
    return LocalAppConfig.get("workspace");
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
