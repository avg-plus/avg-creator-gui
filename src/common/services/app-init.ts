import os from "os";

import { FocusStyleManager } from "@blueprintjs/core";
import { Color, Titlebar } from "custom-electron-titlebar";

import "../local-app-config";
import { logger } from "../lib/logger";
import { remote } from "electron";
import { Env } from "../env";
import "./version-compatibility";
import { AVGWindow } from "../../renderer/windows/gui-window";

export class GUIWindowApplication {
  static titlebar: Titlebar;
  static currentWindow: AVGWindow;

  static start() {
    logger.debug("App start: ", remote.app.getVersion(), os.platform());
    logger.debug("appDataDir", Env.getAppDataDir());

    // Blueprint 焦点设置
    FocusStyleManager.onlyShowFocusOnTabs();

    // 初始化标题栏
    this.titlebar = new Titlebar({
      titleHorizontalAlignment: "center",
      maximizable: true,
      minimizable: true,
      closeable: true,
      backgroundColor: Color.fromHex("#c62d24")
    });
  }

  static setWindow(window: AVGWindow) {
    this.currentWindow = window;
  }
}
