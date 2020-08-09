/** @format */

import "./avg-creator.less";

import { CreatorContext } from "../hooks/context";
import React, { useReducer, useState, Suspense } from "react";
import {
  AVGCreatorReducer,
  AVGCreatorInitialState
} from "../redux/reducers/avg-creator-reducers";
import {
  ButtonGroup,
  Button,
  Icon,
  Popover,
  Position
} from "@blueprintjs/core";
import classNames from "classnames";
import { Env } from "../../common/env";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import { useMount } from "react-use";
import { AutoUpdater } from "../services/autoupdater";

const ProjectListMainPanel = React.lazy(() =>
  import("./project-list-main-panel")
);

const ChangeLogDialog = React.lazy(() =>
  import("../components/changelog-dialog/changelog-dialog")
);

const CreateProjectDialog = React.lazy(() =>
  import("../components/create-project-dialog/create-project-dialog")
);

const BundleManagerDialog = React.lazy(() =>
  import("../components/bundles-manager-dialog/bundles-manager-dialog")
);

const ProjectDetailDialog = React.lazy(() =>
  import("../components/project-detail-dialog/project-details-dialog")
);

const InitWorkspaceDialog = React.lazy(() =>
  import("../components/initial-workspace-dialog/init-workspace-dialog")
);

const MainContextMenu = React.lazy(() =>
  import("../components/context-menus/main-menus")
);

const AboutDialog = React.lazy(() =>
  import("../components/about-dialog/about-dialog")
);

const UpdateAlertDialog = React.lazy(() =>
  import("../components/update-dialog/update-alert")
);

const AVGCreator = () => {
  const [state, dispatch] = useReducer(
    AVGCreatorReducer,
    AVGCreatorInitialState
  );

  const [lazyLoadFlag, setLazyLoadFlag] = useState(false);
  setTimeout(() => {
    setLazyLoadFlag(true);
  }, 1);

  useMount(() => {
    if (AutoUpdater.isAppUpdated()) {
      dispatch({
        type: AVGCreatorActionType.OpenChangeLogDialog,
        payload: {
          open: true
        }
      });
    }
  });

  const [bundleManagerOpenned, setBundleManagerOpenned] = useState(false);

  const renderSettingMenu = () => {
    return (
      <Suspense fallback={<></>}>
        <MainContextMenu
          onOpenAboutDialog={() => {
            dispatch({
              type: AVGCreatorActionType.OpenAboutDialog,
              payload: {
                open: true
              }
            });
          }}
        />{" "}
      </Suspense>
    );
  };

  return (
    <CreatorContext.Provider value={{ state, dispatch }}>
      <div className="bp3-dialog-container avg-window-container">
        <div className="bp3-dialog avg-window-dialog">
          {Env.getOSName() === "MacOS" && (
            <div className="bp3-dialog-header avg-window-header">
              <h4 className="bp3-heading avg-window-header-title">
                AVGPlus Creator
              </h4>
            </div>
          )}

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
                  <Suspense fallback={<></>}>
                    <ProjectListMainPanel />
                  </Suspense>
                </div>

                <div
                  className={classNames({
                    "component-visible": bundleManagerOpenned,
                    "component-hidden": !bundleManagerOpenned
                  })}
                >
                  <Suspense fallback={<></>}>
                    <BundleManagerDialog />
                  </Suspense>
                </div>
              </div>
            </div>
            <div className="avg-creator-footer">
              <Popover content={renderSettingMenu()} position={Position.TOP}>
                <ButtonGroup minimal={true} alignText={"right"}>
                  <Button icon={<Icon icon="cog" />} color="red" />
                </ButtonGroup>
              </Popover>
            </div>
          </div>

          {lazyLoadFlag && (
            <Suspense fallback={<></>}>
              {state.isCreateProjectDialogOpen && <CreateProjectDialog />}
              {state.isAboutDialogOpen && <AboutDialog />}
              {state.isProjectDetailDialogOpen && <ProjectDetailDialog />}
              {state.isSetWorkspaceDialogOpen && <InitWorkspaceDialog />}
              {state.checkUpdateAlert.open && <UpdateAlertDialog />}
              {state.isChangeLogDialogOpen && <ChangeLogDialog />}
            </Suspense>
          )}
        </div>
      </div>
    </CreatorContext.Provider>
  );
};

export default AVGCreator;
