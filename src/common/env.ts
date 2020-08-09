import os from "os";
import fs from "fs-extra";
import path from "path";

import { remote } from "electron";
import { LocalAppConfig } from "./local-app-config";

const app = remote.app;

class _Env {
  appDataDir: string;

  constructor() {
    app.setAppLogsPath();

    // 初始化数据目录
    const appData = app.getPath("appData");
    const appName = app.getName();
    this.appDataDir = path.join(appData, appName);
    fs.ensureDirSync(this.appDataDir);
  }

  isDevelopment() {
    return process.env.NODE_ENV === "development";
  }

  isProduction() {
    return process.env.NODE_ENV === "production";
  }

  getAppDataDir() {
    return Env.appDataDir;
  }

  getOSName(): "MacOS" | "Windows" {
    const platforms = {
      darwin: "MacOS",
      win32: "Windows"
    };

    return platforms[os.platform()];
  }

  // 获取游戏模板工程目录
  getUpdatesDir() {
    return path.join(this.getAppDataDir(), "updates/");
  }

  // 获取游戏模板工程目录
  getBundleDir() {
    return path.join(this.getAppDataDir(), "avg-bundles/");
  }

  // 获取游戏模板工程目录
  getAVGProjectTemplateDir() {
    return path.join(this.getBundleDir(), "project-templates");
  }

  // 获取游戏引擎包目录
  getAVGEngineBundleDir() {
    return path.join(this.getBundleDir(), "engines");
  }

  // 获取Electron镜像目录
  getElectronMirrorBundleDir() {
    return path.join(this.getBundleDir(), "electron-mirrors");
  }

  // 获取工作目录
  getWorkspace() {
    return LocalAppConfig.get("workspace");
  }

  init() {}
}

export const Env = new _Env();
