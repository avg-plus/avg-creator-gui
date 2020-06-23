/** @format */

import { Progress as AntdProgress } from "antd";
import { Progress } from "got";

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
  Classes
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

  const [progress, setProgress] = useState(0);
  console.log("trigger rendering", progress);

  useMount(() => {
    BundlesManager.checkingBundles(
      (
        current: {
          bundle: IBundle;
          index: number;
          progress: Progress;
        },
        list: Array<IBundle>
      ) => {
        const p = current.progress.percent * 100;
        setProgress(p);
        if (current.progress.percent >= 1) {
          setProgress(0);
          return;
        }

        GUIToaster.show(
          {
            icon: "cube",
            timeout: 0,
            message: (
              <>
                <div className="bp3-running-text">
                  正在下载 ({current.index + 1}/{list.length}):
                  <div>
                    ({formatBytes(current.progress.transferred, 1)}/
                    {formatBytes(current.progress.total ?? 0, 1)})
                  </div>
                </div>

                {(current.progress.percent * 100).toFixed(0)}
                {/* <AntdProgress percent={current.progress.percent * 100} /> */}
                {/* 
                <ProgressBar
                  stripes={false}
                  className={classNames("docs-toast-progress", {
                    [Classes.PROGRESS_NO_STRIPES]: current.progress.percent >= 1
                  })}
                  intent={
                    current.progress.percent < 1
                      ? Intent.PRIMARY
                      : Intent.SUCCESS
                  }
                  value={
                    Number.parseFloat(current.progress.percent.toFixed(0)) / 100
                  }
                /> */}
              </>
            )
          },
          "bundle-updates"
        );

        if (
          current.index + 1 === list.length &&
          current.progress.percent >= 1
        ) {
          GUIToaster.show(
            {
              message: "AVGPlus 数据已更新",
              icon: "updated",
              timeout: 5000,
              intent: Intent.SUCCESS
            },
            "bundle-updates"
          );
        }
      }
    );
  });

  // const handleCheckUpdates = useCallback(async () => {

  // }, []);

  // async () => {
  //   GUIToaster.show({ message: "开始检查资源更新" }, "bundle-updates");
  // };

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
              <ProjectListMainPanel />
            </div>
            <div className="avg-creator-footer">
              <ButtonGroup minimal={true} alignText={"right"}>
                <Tooltip
                  content="当前没有任何更新任务"
                  intent={Intent.SUCCESS}
                  position={Position.TOP}
                >
                  <Button icon={<Icon icon="cloud-download" />} />
                </Tooltip>
                <Divider />

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
