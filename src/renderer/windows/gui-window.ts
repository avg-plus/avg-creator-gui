import {
  remote,
  BrowserWindowConstructorOptions,
  BrowserWindow
} from "electron";

import { WindowIDs } from "../../common/window-ids";
import { logger } from "../common/lib/logger";
import { windowManager } from "../common/remote-objects/remote-windows-manager";

export interface AVGWindowOptions {
  browserWindowOptions: BrowserWindowConstructorOptions;

  // 是否单一窗口，不允许创建多个窗口实例
  singleton?: boolean;

  // 是否模态窗口
  modal?: boolean;

  // 是否自动显示
  autoShow?: boolean;

  // 关闭窗口时是否销毁
  destroyOnClosed?: boolean;
}

export abstract class AVGWindow {
  readonly id: WindowIDs;
  uniqueID: number;

  htmlFile: string;
  options: AVGWindowOptions;

  constructor(id: WindowIDs, file: string, options: AVGWindowOptions) {
    this.id = id;
    this.htmlFile = file;

    options.autoShow = options.autoShow ?? true;
    options.modal = options.autoShow ?? false;
    options.singleton = options.autoShow ?? true;
    options.destroyOnClosed = options.destroyOnClosed ?? true;

    this.options = options;
  }

  async preload() {
    // 预创建窗体，加载但不显示
    this.options.autoShow = false;
    (await this.open())?.hide();
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
    this.uniqueID = browserWindow.id;

    return browserWindow;
  }

  async browserWindow(instanceID: string = "default") {
    return await windowManager.getWindow(this.id, instanceID);
  }

  async setTitle(title: string, instanceID?: string) {
    const instance = await this.getInstance(instanceID);
    instance?.setTitle(title);
  }

  async close(instanceID?: string) {
    await windowManager.requestCloseWindow(
      this.id,
      instanceID,
      this.options.destroyOnClosed
    );
  }

  async setParent(parent: AVGWindow) {
    const parentWindow = await parent.browserWindow();
    if (!parentWindow) {
      return;
    }

    this.options.browserWindowOptions.parent = parentWindow;
  }

  async open<T extends object>(params?: T, instanceID?: string) {
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

      browserWindow.webContents.once("dom-ready", () => {
        browserWindow.webContents.openDevTools();
      });

      browserWindow.on("page-title-updated", (evt) => {
        evt.preventDefault();
      });

      browserWindow.on("ready-to-show", () => {
        if (this.options.autoShow) {
          browserWindow.show();
        }
      });

      browserWindow.loadFile("./dist/static/" + this.htmlFile, {
        query: params ?? {}
      });
    } else {
      browserWindow = existsWindow;
    }

    if (!browserWindow) {
      remote.dialog.showErrorBox("错误", "无法创建窗口。");
      return;
    }

    logger.info(`Window ${this.id} loaded.`);

    return browserWindow;
  }

  private async getInstance(instanceID?: string) {
    if (this.options.singleton) {
      instanceID = "default";
    }

    return windowManager.getWindow(this.id, instanceID ?? "default");
  }
}
