import React, { useContext, Fragment } from "react";
import {
  Drawer,
  Card,
  Elevation,
  Tag,
  Intent,
  Icon,
  Checkbox,
  Button
} from "@blueprintjs/core";
import { CreatorContext } from "../../hooks/context";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";

import { IAVGServer } from "../../redux/reducers/avg-creator-reducers";
import "./project-details-dialog.less";
import classNames from "classnames";
import { GameRunner } from "../../services/game-runner";

export interface IProjectDetailDialogProps {
  server: IAVGServer;
}

export const ProjectDetailDialog = (props: IProjectDetailDialogProps) => {
  const { state, dispatch } = useContext(CreatorContext);

  return (
    <Drawer
      isOpen={state.isProjectDetailDialogOpen}
      position={"bottom"}
      size={"90%"}
      icon="info-sign"
      canOutsideClickClose={true}
      hasBackdrop={false}
      autoFocus={true}
      enforceFocus={true}
      usePortal={true}
      isCloseButtonShown={true}
      onClose={() => {
        dispatch({
          type: AVGCreatorActionType.OpenProjectDetailDialog,
          payload: {
            open: false
          }
        });
      }}
    >
      <>
        <div
          className={classNames("status-card", {
            active: state.currentServer.isRunning,
            inactive: !state.currentServer.isRunning
          })}
        >
          <div className={"title"}>{state.openedProject?.name}</div>
          <Tag
            className="status-tag"
            icon={
              state.currentServer.isRunning ? (
                <Icon icon={"play"} />
              ) : (
                <Icon icon={"stop"} />
              )
            }
            intent={
              state.currentServer.isRunning ? Intent.SUCCESS : Intent.DANGER
            }
          >
            {state.currentServer.isRunning ? "运行中" : "未运行"}
          </Tag>

          <div className="status-info-container">
            {/* <div className={""}>{state.currentServer}</div> */}
          </div>

          <div className="options-container">
            <Checkbox checked={true} label="通过 HTTP 监听资源目录" />
          </div>

          <Button
            onClick={() => {
              GameRunner.runAsDesktop();
            }}
          >
            打开
          </Button>

          <div className={"footer"}></div>
        </div>
      </>
    </Drawer>
  );
};
