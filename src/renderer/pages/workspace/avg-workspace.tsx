import React from "react";
import ReactDOM from "react-dom";

window.React = React;
window.ReactDOM = ReactDOM;
window["$"] = window["jQuery"] = require("jquery");

import { useMount } from "react-use";
import { WorkspaceLayout } from "../../services/workspace-layout";
import { delayExecution } from "../../../common/utils";

import "./avg-workspace.less";
import { StoryManager } from "../../services/storyboard/story-manager";
import { FocusStyleManager } from "@blueprintjs/core";
import { Codegen } from "../../services/storyboard/codegen";

FocusStyleManager.onlyShowFocusOnTabs();

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
