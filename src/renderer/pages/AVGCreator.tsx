/** @format */

import * as React from "react";
import styled from "styled-components";

import "./AVGCreator.less";

import { CreatorContext } from "../hooks/context";
import { useReducer, useEffect } from "react";
import {
  AVGCreatorReducer,
  AVGCreatorInitialState
} from "../redux/reducers/avg-creator-reducers";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import { CreateProjectDialog } from "../components/create-project-dialog/create-project-dialog";
import { PanelStack, Button } from "@blueprintjs/core";
import { ProjectListMainPanel } from "./ProjectListMainPanel";
import { InitWorkspaceDialog } from "../components/initial-workspace-dialog/init-workspace-dialog";

const AVGCreator = () => {
  const [state, dispatch] = useReducer(
    AVGCreatorReducer,
    AVGCreatorInitialState
  );

  const onPanelOpen = () => {
    dispatch({ type: AVGCreatorActionType.OpenSettingPanel });
  };

  const onPanelClose = () => {
    dispatch({ type: AVGCreatorActionType.CloseSettingPanel });
  };

  return (
    <CreatorContext.Provider value={{ state, dispatch }}>
      <div className="bp3-dialog-container avg-window-container">
        <div className="bp3-dialog avg-window-dialog">
          <div className="bp3-dialog-header avg-window-header">
            <h4 className="bp3-heading avg-window-header-title">
              AVGPlus Creator
            </h4>
          </div>

          <div className="bp3-dialog-body avg-window-body">
            <div className="body-content">
              {/* <ToolBar></ToolBar> */}
              <PanelStack
                className="panel-stack"
                showPanelHeader={state.isShowPanelHeader}
                initialPanel={{ component: ProjectListMainPanel }}
                onOpen={onPanelOpen}
                onClose={onPanelClose}
              />
            </div>
          </div>
          <CreateProjectDialog />
          <InitWorkspaceDialog />
        </div>
      </div>
    </CreatorContext.Provider>
  );
};

export default AVGCreator;
