import React, { useContext, Fragment } from "react";
import {
  Drawer,
  Card,
  Elevation,
  Tag,
  Intent,
  Icon as BPIcon,
  Checkbox,
  Button,
  ButtonGroup,
  AnchorButton
} from "@blueprintjs/core";

import Icon, { BugFilled } from "@ant-design/icons";

import { CreatorContext } from "../../hooks/context";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";

import { IAVGServer } from "../../redux/reducers/avg-creator-reducers";
import "./project-details-dialog.less";
import classNames from "classnames";
import { GameRunner } from "../../services/game-runner";
import { DebugServer } from "../../../main/debug-server/debug-server";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

import VSCodeICON from "../../images/icons/vscode.svg";

export interface IProjectDetailDialogProps {
  server: IAVGServer;
}

export const ProjectDetailDialog = (props: IProjectDetailDialogProps) => {
  const { state, dispatch } = useContext(CreatorContext);

  const renderWebURL = () => {
    const engineURL = GameRunner.getRunningServerURL("Engine");
    if (state.openedProject?.supportBrowser) {
      if (GameRunner.isWebServerRunning("Engine")) {
        return (
          <Button minimal={true} rightIcon={"share"}>
            {engineURL}
          </Button>
        );
      } else {
        return <Tag>未启动</Tag>;
      }
    } else {
      return "该项目不支持浏览器部署";
    }

    return "";
  };

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
                <BPIcon icon={"play"} />
              ) : (
                <BPIcon icon={"stop"} />
              )
            }
            intent={
              state.currentServer.isRunning ? Intent.SUCCESS : Intent.DANGER
            }
          >
            {state.currentServer.isRunning ? "运行中" : "未运行"}
          </Tag>

          <div className="status-info-container">
            <Row className="info-row">
              <Col span={12}>
                <BugFilled /> 调试服务器
              </Col>
              <Col span={12}>col-12</Col>
            </Row>
            <Row className="info-row">
              <Col span={12}>
                <BugFilled /> 工程目录
              </Col>
              <Col span={12}>
                <ButtonGroup minimal={true}>
                  <Button className={"path-text"} fill={true}>
                    用 VSCode 打开 <Icon component={VSCodeICON}></Icon>
                  </Button>
                  <AnchorButton rightIcon="caret-down"></AnchorButton>
                </ButtonGroup>
              </Col>
            </Row>
            <Row className="info-row">
              <Col span={12}>
                <BugFilled /> 浏览器 URL
              </Col>
              <Col span={12}>{renderWebURL()}</Col>
            </Row>
          </div>

          <div className="options-container">
            <Checkbox checked={true} label="自动刷新" />
            <Checkbox checked={true} label="热加载" />
          </div>

          <div className={"footer"}>
            <Button
              onClick={async () => {
                if (state.openedProject) {
                  await DebugServer.start();
                  await GameRunner.runAsDesktop(state.openedProject);
                }
              }}
            >
              打开
            </Button>
            <Button
              onClick={async () => {
                if (state.openedProject) {
                  await GameRunner.serve(state.openedProject);
                }
              }}
            >
              打开
            </Button>
          </div>
        </div>
      </>
    </Drawer>
  );
};
