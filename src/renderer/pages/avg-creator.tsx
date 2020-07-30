/** @format */

import "./avg-creator.less";

import { CreatorContext } from "../hooks/context";
import React, { useReducer, useState } from "react";
import {
  AVGCreatorReducer,
  AVGCreatorInitialState
} from "../redux/reducers/avg-creator-reducers";
import { CreateProjectDialog } from "../components/create-project-dialog/create-project-dialog";
import { ButtonGroup, Button, Icon } from "@blueprintjs/core";
import { ProjectListMainPanel } from "./project-list-main-panel";
import { InitWorkspaceDialog } from "../components/initial-workspace-dialog/init-workspace-dialog";
import classNames from "classnames";
import { BundleManagerDialog } from "../components/bundles-manager-dialog/bundles-manager-dialog";
import { ProjectDetailDialog } from "../components/project-detail-dialog/project-details-dialog";

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
              <div className="main-panel-container max-size">
                <div
                  className={classNames({
                    "component-visible": !bundleManagerOpenned,
                    "component-hidden": bundleManagerOpenned
                  })}
                >
                  <ProjectListMainPanel />
                </div>

                <div
                  className={classNames({
                    "component-visible": bundleManagerOpenned,
                    "component-hidden": !bundleManagerOpenned
                  })}
                >
                  <BundleManagerDialog />
                </div>
              </div>
            </div>
            <div className="avg-creator-footer">
              <ButtonGroup minimal={true} alignText={"right"}>
                <Button icon={<Icon icon="cog" />} color="red" />
              </ButtonGroup>
            </div>
          </div>

          {state.isCreateProjectDialogOpen && <CreateProjectDialog />}
          <ProjectDetailDialog server={state.currentServer} />
          <InitWorkspaceDialog />
        </div>
      </div>
    </CreatorContext.Provider>
  );
};

export default AVGCreator;
