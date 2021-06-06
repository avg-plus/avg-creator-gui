/** @format */

import * as React from "react";
import * as ReactDOM from "react-dom";

import { Env } from "../common/env";
import "../common/lib/logger";

import { Titlebar, Color } from "custom-electron-titlebar";
import { AppInit } from "../common/services/app-init";

import "./index.less";
import { ProjectBrowserGUIWindow } from "./pages/project-browser-gui/project-browser-gui";

// ========================================
// 初始化应用
// ========================================

AppInit.start();

if (Env.getOSName() === "Windows") {
  new Titlebar({
    titleHorizontalAlignment: "left",
    maximizable: true,
    minimizable: true,
    closeable: true,
    backgroundColor: Color.fromHex("#AA3029")
  });
}

ReactDOM.render(
  <ProjectBrowserGUIWindow />,
  document.getElementById("root") as HTMLElement
);
