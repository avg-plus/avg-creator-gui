import React from "react";
import ReactDOM from "react-dom";

window.React = React;
window.ReactDOM = ReactDOM;
window["$"] = window["jQuery"] = require("jquery");

import { useMount } from "react-use";
import { WorkspaceLayout } from "../../services/workspace-layout";
import { delayExecution } from "../../../common/utils";

import "./avg-workspace.less";

export const AVGWorkspace = () => {
  useMount(() => {
    delayExecution(() => {
      WorkspaceLayout.initLayout();
    }, 0);
  });

  return <div id="workspace-container"></div>;
};
