import * as React from "react";
import * as ReactDOM from "react-dom";
import "./project-resource-gui.index.less";

import { RendererApplication } from "../common/services/renderer-application";
import { ProjectResourcePage } from "./pages/project-resource-gui/project-resource-page";
import { ProjectResourceWindow } from "./windows/project-resource-window";

RendererApplication.setWindow(ProjectResourceWindow);
RendererApplication.start();

ReactDOM.render(
  <ProjectResourcePage />,
  document.getElementById("root") as HTMLElement
);
