import React from "react";
import ReactDOM from "react-dom";

window.React = React;
window.ReactDOM = ReactDOM;
window["$"] = window["jQuery"] = require("jquery");

import { useMount } from "react-use";
import { WorkspaceLayout } from "../../../common/services/workspace-layout";
import { delayExecution } from "../../../common/utils";

import "./avg-workspace.less";
import { StoryManager } from "../../../common/services/story-manager";
import { Codegen } from "../../../common/services/storyboard/codegen";

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
