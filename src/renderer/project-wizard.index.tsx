import * as React from "react";
import * as ReactDOM from "react-dom";
import "../common/lib/logger";

import "./project-wizard.index.less";

import { RendererApplication } from "../common/services/renderer-application";
import { ProjectWizardPage } from "./pages/project-wizard/project-wizard-page";
import { ProjectWizardWindow } from "./windows/project-wizard-window";

RendererApplication.setWindow(ProjectWizardWindow);
RendererApplication.start({ hasTitlebar: false });

ReactDOM.render(
  <ProjectWizardPage />,
  document.getElementById("root") as HTMLElement
);
