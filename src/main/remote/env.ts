import path from "path";
import os from "os";
import { remote, app as ElectronApp } from "electron";

let app: Electron.App = ElectronApp;
if (process.type === "renderer") {
  app = remote.app;
}

export class _Env {
  isDevelopment() {
    return process.env.NODE_ENV === "development";
  }

  isProduction() {
    return process.env.NODE_ENV === "production";
  }

  getOSName(): "MacOS" | "Windows" {
    const platforms = {
      darwin: "MacOS",
      win32: "Windows"
    };

    return platforms[os.platform()];
  }

  getAppVersion() {
    return app.getVersion();
  }

  isMacOS() {
    return this.getOSName() === "MacOS";
  }

  isWindows() {
    return this.getOSName() === "Windows";
  }

  getAppDataDir(): string {
    // 初始化数据目录
    const appData = app.getPath("appData");
    const appName = app.getName();
    return path.join(appData, appName);
  }
}

export default new _Env();
