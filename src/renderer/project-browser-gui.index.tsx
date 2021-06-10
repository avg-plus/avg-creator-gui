import * as React from "react";
import * as ReactDOM from "react-dom";
import "../common/lib/logger";

import "./project-browser-gui.index.less";
import { GUIWindowApplication } from "../common/services/app-init";
import { ProjectBrowserGUIView } from "./pages/project-browser-gui/project-browser-gui";
import { ProjectBrowserWindow } from "./windows/project-browser-window";

GUIWindowApplication.setWindow(ProjectBrowserWindow);
GUIWindowApplication.start();

ReactDOM.render(
  <ProjectBrowserGUIView />,
  document.getElementById("root") as HTMLElement
);
