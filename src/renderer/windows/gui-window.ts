import {
  remote,
  BrowserWindowConstructorOptions,
  BrowserWindow
} from "electron";
import { Env } from "../../common/env";
import { WindowIDs } from "../../common/window-ids";
import { windowManager } from "./remote-windows-manager";

export interface AVGWindowOptions {
  browserWindowOptions: BrowserWindowConstructorOptions;

  // 是否单一窗口，不允许创建多个窗口实例
  singleton?: boolean;

  // 是否模态窗口
  modal?: boolean;

  // 是否自动显示
  autoShow?: boolean;
}

export class AVGWindow<T> {
  readonly id: WindowIDs;

  htmlFile: string;
  options: AVGWindowOptions;

  constructor(id: WindowIDs, file: string, options: AVGWindowOptions) {
    this.id = id;
    this.htmlFile = file;

    options.autoShow = options.autoShow ?? true;
    options.modal = options.autoShow ?? false;
    options.singleton = options.autoShow ?? true;

    this.options = options;
  }

  private async createWindow(instanceID: string = "default") {
    if (this.options.singleton) {
      instanceID = "default";
    }

    const window = await windowManager.getWindow(this.id, instanceID);
    if (window) {
      return window;
    }

    // 创建窗口对象
    const browserWindow = new remote.BrowserWindow({
      ...this.options.browserWindowOptions,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        allowRunningInsecureContent: false
      }
    });

    // 注册到窗口管理器
    await windowManager.registerWindow(this.id, browserWindow.id, instanceID);

    return browserWindow;
  }

  async setTitle(title: string, instanceID?: string) {
    const instance = await this.getInstance(instanceID);
    instance?.setTitle(title);
  }

  async close(destroy: boolean = false, instanceID?: string) {
    const instance = await this.getInstance(instanceID);

    instance?.hide();
    if (destroy) {
      instance?.close();
    }
  }

  async open(params?: T, instanceID?: string) {
    if (this.options.singleton) {
      instanceID = "default";
    }

    const existsWindow = await windowManager.getWindow(
      this.id,
      instanceID ?? "default"
    );

    let browserWindow: BrowserWindow;
    if (!existsWindow) {
      browserWindow = await this.createWindow();
    } else {
      browserWindow = existsWindow;
    }

    browserWindow.webContents.once("dom-ready", () => {
      if (Env.isDevelopment()) {
        browserWindow.webContents.openDevTools();
      }
    });

    if (this.options.autoShow) {
      browserWindow.once("ready-to-show", () => {
        browserWindow.show();
      });
    }

    browserWindow.loadFile("./dist/static/" + this.htmlFile, {
      query: params ?? {}
    });
  }

  private async getInstance(instanceID?: string) {
    if (this.options.singleton) {
      instanceID = "default";
    }

    return windowManager.getWindow(this.id, instanceID ?? "default");
  }
}
