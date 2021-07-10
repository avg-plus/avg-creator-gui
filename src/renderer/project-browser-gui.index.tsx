import * as React from "react";
import * as ReactDOM from "react-dom";

import "./project-browser-gui.index.less";
import { RendererApplication } from "../common/services/renderer-application";
import { ProjectBrowserPage } from "./pages/project-browser-gui/project-browser-page";
import { ProjectBrowserWindow } from "./windows/project-browser-window";

RendererApplication.setWindow(ProjectBrowserWindow);
RendererApplication.start();

ReactDOM.render(
  <ProjectBrowserPage />,
  document.getElementById("root") as HTMLElement
);
