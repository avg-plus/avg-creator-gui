import React from "react";
import ReactDOM from "react-dom";

window.React = React;
window.ReactDOM = ReactDOM;
window["$"] = window["jQuery"] = require("jquery");

import { useMount } from "react-use";
import { WorkspaceLayout } from "../../../common/services/workspace-layout";
import { delayExecution } from "../../../common/utils";

import "./avg-workspace.less";
import { StoryManager } from "../../../common/services/storyboard/story-manager";
import { FocusStyleManager } from "@blueprintjs/core";
import { Codegen } from "../../../common/services/storyboard/codegen";
import { ipcRenderer, IpcRendererEvent } from "electron";
import { Workspace } from "../../../common/services/workspace";
import { AVGProjectData } from "../../../common/manager/project-manager";

FocusStyleManager.onlyShowFocusOnTabs();

// ipcRenderer.once(
//   "InitAVGProject",
//   (event: IpcRendererEvent, ...args: any[]) => {
//     const project = args[0] as AVGProjectData;
//     Workspace.loadProject(project);
//   }
// );

export const AVGWorkspace = () => {
  useMount(() => {
    delayExecution(() => {
      WorkspaceLayout.initLayout();
      StoryManager.init();
      Codegen.init();
    }, 0);
  });

  return <div id="workspace-container"></div>;
};
