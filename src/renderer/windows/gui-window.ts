import {
  remote,
  BrowserWindowConstructorOptions,
  BrowserWindow
} from "electron";
import { Env } from "../../common/env";

export class AVGWindow {
  browserWindow!: BrowserWindow;
  htmlFile: string;
  options: BrowserWindowConstructorOptions;

  constructor(file: string, options: BrowserWindowConstructorOptions) {
    this.htmlFile = file;
    this.options = options;

    this.initBrowserWindow();
  }

  private initBrowserWindow() {
    if (!this.browserWindow || this.browserWindow.isDestroyed()) {
      this.browserWindow = new remote.BrowserWindow({
        ...this.options,
        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          allowRunningInsecureContent: false
        }
      });
    }
  }

  setTitle(title: string) {
    this.browserWindow.setTitle(title);
  }

  close() {
    this.browserWindow.close();
  }

  hide() {
    this.browserWindow.hide();
  }

  open(params: any, options: { autoShow: boolean } = { autoShow: true }) {
    this.initBrowserWindow();

    this.browserWindow.webContents.setBackgroundThrottling(true);
    this.browserWindow.webContents.once("dom-ready", () => {
      if (Env.isDevelopment()) {
        this.browserWindow.webContents.openDevTools();
      }
    });

    if (options.autoShow) {
      this.browserWindow.once("ready-to-show", () => {
        this.browserWindow.show();
      });
    }

    this.browserWindow.loadFile("./dist/static/" + this.htmlFile, {
      query: params
    });
  }
}
