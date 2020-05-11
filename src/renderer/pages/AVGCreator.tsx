/** @format */

import * as React from "react";
// import { ipcMain, ipcRenderer } from "electron-better-ipc"
// import fs from "fs-extra"
// var remote = require("electron").remote
// var electronFs = remote.require("fs")

import { AVGCreatorPortal } from "./AVGCreatorPortal";
import "./AVGCreator.less";

import { CreatorContext } from "../hooks/context";
import { useReducer, useState, useEffect, useCallback } from "react";
import {
  AVGCreatorReducer,
  AVGCreatorInitialState
} from "../redux/reducers/avg-creator-reducers";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import { CreateProjectDialog } from "../components/create-project-dialog/create-project-dialog";

const AVGCreator = () => {
  const [state, dispatch] = useReducer(
    AVGCreatorReducer,
    AVGCreatorInitialState
  );

  useEffect(() => {
    dispatch({ type: AVGCreatorActionType.CloseSettingPanel });
  }, [state.isSettingPanelOpen]);

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
              <AVGCreatorPortal></AVGCreatorPortal>
            </div>
          </div>
          <CreateProjectDialog />

          {/* {!state.isSettingPanelOpen && (
            <div className="bp3-dialog-header avg-creator-footer">
              <div className="bp3-button-group .modifier">

              </div>
            </div>
          )} */}
        </div>
      </div>
    </CreatorContext.Provider>
  );
};

export default AVGCreator;
