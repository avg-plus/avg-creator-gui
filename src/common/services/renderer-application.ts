import os from "os";

import { FocusStyleManager } from "@blueprintjs/core";
import { Color, Titlebar } from "custom-electron-titlebar";

import { AVGWindow } from "../../renderer/windows/gui-window";
import "../../common/ipc-observable/index";

export interface GUIWindowApplicationOptions {
  hasTitlebar: boolean;
}
export class RendererApplication {
  static titlebar: Titlebar;
  static currentWindow: AVGWindow;
  static ThemePrimaryColor = "#c62d24";

  static start(options?: GUIWindowApplicationOptions) {
    options = options ?? {
      hasTitlebar: true
    };

    // Blueprint 焦点设置
    FocusStyleManager.onlyShowFocusOnTabs();

    // 初始化标题栏
    if (options.hasTitlebar) {
      this.titlebar = new Titlebar({
        titleHorizontalAlignment: "center",
        maximizable: true,
        minimizable: true,
        closeable: true,
        backgroundColor: Color.fromHex(RendererApplication.ThemePrimaryColor)
      });
    }
  }

  static setWindow(window: AVGWindow) {
    this.currentWindow = window;
  }

  static updateTitle(title: string) {
    this.titlebar.updateTitle(title);
  }
}
