import {
  remote,
  BrowserWindowConstructorOptions,
  BrowserWindow
} from "electron";
import { Env } from "../../common/env";
import { WindowIDs } from "../common/window-ids";
import { WindowsManager } from "./windows-manager";

export class AVGWindow {
  readonly id: WindowIDs;
  _browserWindow: BrowserWindow;
  htmlFile: string;
  options: BrowserWindowConstructorOptions;

  constructor(
    id: WindowIDs,
    file: string,
    options: BrowserWindowConstructorOptions
  ) {
    this.id = id;
    this.htmlFile = file;
    this.options = options;

    this.initBrowserWindow();
  }

  // get browserWindow() {
  //   return WindowsManager.getWindow(this.id);
  // }

  private async initBrowserWindow() {
    // console.log("this.browserWindow", this.browserWindow);

    if (!this._browserWindow || this._browserWindow.isDestroyed()) {
      // 创建窗口对象
      this._browserWindow = new remote.BrowserWindow({
        ...this.options,
        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          allowRunningInsecureContent: false
        }
      });

      // 注册到窗口管理器
      WindowsManager.registerWindow(this.id, this._browserWindow.id);
    }
  }

  setTitle(title: string) {
    this._browserWindow.setTitle(title);
  }

  close() {
    this._browserWindow.close();
  }

  hide() {
    this._browserWindow.hide();
  }

  open(params: any, options: { autoShow: boolean } = { autoShow: true }) {
    this.initBrowserWindow();

    this._browserWindow.webContents.openDevTools();

    // this._browserWindow.webContents.setBackgroundThrottling(true);
    this._browserWindow.webContents.once("dom-ready", () => {
      if (Env.isDevelopment()) {
        this._browserWindow.webContents.openDevTools();
      }
    });

    if (options.autoShow) {
      this._browserWindow.once("ready-to-show", () => {
        this._browserWindow.show();
      });
    }

    this._browserWindow.loadFile("./dist/static/" + this.htmlFile, {
      query: params
    });
  }
}
