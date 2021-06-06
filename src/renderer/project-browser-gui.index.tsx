import * as React from "react";
import * as ReactDOM from "react-dom";
import "../common/lib/logger";

import { Color, Titlebar } from "custom-electron-titlebar";

import "./project-browser-gui.index.less";
import { AppInit } from "../common/services/app-init";
import { ProjectBrowserGUIWindow } from "./pages/project-browser-gui/project-browser-gui";

// ========================================
// 初始化应用
// ========================================

AppInit.start();

new Titlebar({
  titleHorizontalAlignment: "center",
  maximizable: false,
  minimizable: false,
  closeable: true,
  backgroundColor: Color.fromHex("#c62d24")
});

ReactDOM.render(
  <ProjectBrowserGUIWindow />,
  document.getElementById("root") as HTMLElement
);
