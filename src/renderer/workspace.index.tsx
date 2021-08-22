import * as React from "react";
import * as ReactDOM from "react-dom";
import fs from "fs-extra";
import url from "url";
import querystring from "querystring";

import "./workspace.index.less";

import { AVGWorkspace } from "./pages/workspace/avg-workspace";
import { RendererApplication } from "../common/services/renderer-application";
import { WorkspaceWindow } from "./windows/workspace-window";
import { remote } from "electron";
import { GUIWorkspaceService } from "./pages/workspace/avg-workspace.service";

const URL = remote.getCurrentWindow().webContents.getURL();

const urlObject = url.parse(URL);
if (urlObject && urlObject.query?.length) {
  const params = querystring.parse(urlObject.query);

  const projectDir = params.project_dir as string;
  if (!projectDir || !fs.existsSync(projectDir)) {
    remote.dialog.showMessageBox({
      type: "error",
      title: "打开项目失败",
      message: "无法打开项目，请检查路径是否正确。"
    });

    remote.getCurrentWindow().close();
  } else {
    ReactDOM.render(
      <AVGWorkspace />,
      document.getElementById("root") as HTMLElement
    );

    RendererApplication.setWindow(WorkspaceWindow);
    RendererApplication.start();

    GUIWorkspaceService.setProject(projectDir);
  }
}
