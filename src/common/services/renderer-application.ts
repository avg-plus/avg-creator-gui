import os from "os";

import { FocusStyleManager } from "@blueprintjs/core";
import { Color, Titlebar } from "custom-electron-titlebar";

import { remote } from "electron";
import { AVGWindow } from "../../renderer/windows/gui-window";
import "../../common/ipc-observable/index";
import { Env } from "../../renderer/common/remote-objects/remote-env";
import { logger } from "../../renderer/common/lib/logger";

export interface GUIWindowApplicationOptions {
  hasTitlebar: boolean;
}
export class RendererApplication {
  static titlebar: Titlebar;
  static currentWindow: AVGWindow;

  static start(options?: GUIWindowApplicationOptions) {
    options = options ?? {
      hasTitlebar: true
    };

    // logger.debug("App start: ", remote.app.getVersion(), os.platform());
    // logger.debug("appDataDir", Env.getAppDataDir());

    // Blueprint 焦点设置
    FocusStyleManager.onlyShowFocusOnTabs();

    // 初始化标题栏
    if (options.hasTitlebar) {
      this.titlebar = new Titlebar({
        titleHorizontalAlignment: "center",
        maximizable: true,
        minimizable: true,
        closeable: true,
        backgroundColor: Color.fromHex("#c62d24")
      });
    }
  }

  static setWindow(window: AVGWindow) {
    this.currentWindow = window;
  }
}
