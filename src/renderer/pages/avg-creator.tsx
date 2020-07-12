/** @format */

import { Progress as AntdProgress } from "antd";

import "./avg-creator.less";

import { CreatorContext } from "../hooks/context";
import React, { useReducer, useState, useEffect, useCallback } from "react";
import {
  AVGCreatorReducer,
  AVGCreatorInitialState
} from "../redux/reducers/avg-creator-reducers";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import { CreateProjectDialog } from "../components/create-project-dialog/create-project-dialog";
import {
  PanelStack,
  ButtonGroup,
  Button,
  Icon,
  Intent,
  Divider,
  Popover,
  Position,
  Tooltip,
  ProgressBar,
  Classes,
  Tab,
  Tabs
} from "@blueprintjs/core";
import { ProjectListMainPanel } from "./project-list-main-panel";
import { InitWorkspaceDialog } from "../components/initial-workspace-dialog/init-workspace-dialog";
import {
  BundlesManager,
  IEngineBundle,
  IBundle
} from "../services/bundles-manager/bundles-manager";
import { GUIToaster } from "../services/toaster";
import classNames from "classnames";
import { formatBytes, sleep } from "../../common/utils";
import { useMount, useMotion } from "react-use";
import { BundleManagerDialog } from "../components/bundles-manager-dialog/bundles-manager-dialog";

const AVGCreator = () => {
  const [state, dispatch] = useReducer(
    AVGCreatorReducer,
    AVGCreatorInitialState
  );

  const [bundleManagerOpenned, setBundleManagerOpenned] = useState(false);

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
            <div className="toolbar">
              <ButtonGroup>
                <Button
                  active={!bundleManagerOpenned}
                  icon="projects"
                  onClick={() => {
                    setBundleManagerOpenned(false);
                  }}
                >
                  项目
                </Button>
                <Button
                  active={bundleManagerOpenned}
                  icon="cloud-download"
                  onClick={() => {
                    setBundleManagerOpenned(true);
                  }}
                >
                  远程资源
                </Button>
              </ButtonGroup>
            </div>
            <div className="body-content">
              {bundleManagerOpenned && <BundleManagerDialog />}
              {!bundleManagerOpenned && <ProjectListMainPanel />}
            </div>
            <div className="avg-creator-footer">
              <ButtonGroup minimal={true} alignText={"right"}>
                {/* <Tooltip
                  // content={downloadingTips}
                  intent={Intent.SUCCESS}
                  position={Position.TOP}
                >
                  <Button
                    active={bundleManagerOpenned}
                    icon={<Icon icon="cloud-download" />}
                    onClick={() => {
                      setBundleManagerOpenned(!bundleManagerOpenned);
                    }}
                  />
                </Tooltip>
                <Divider /> */}

                <Button icon={<Icon icon="cog" />} color="red" />
              </ButtonGroup>
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
