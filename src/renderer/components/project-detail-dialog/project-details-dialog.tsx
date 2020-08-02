import React, { useContext, Fragment, useState, useEffect } from "react";
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
  AnchorButton,
  Popover,
  Menu,
  MenuItem,
  Switch
} from "@blueprintjs/core";

import Icon, { BugFilled } from "@ant-design/icons";

import { CreatorContext } from "../../hooks/context";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";

import { IAVGServer } from "../../redux/reducers/avg-creator-reducers";
import "./project-details-dialog.less";
import classNames from "classnames";
import { GameRunner } from "../../services/game-runner";
import {
  DebugServer,
  WSServerStatus
} from "../../../main/debug-server/debug-server";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

import VSCodeICON from "../../images/icons/vscode.svg";
import { VSCode } from "../../services/vscode";
import { GUIToaster } from "../../services/toaster";
import { useServe, useStopServe } from "../../hooks/use-serve";
import { useLaunchGame, useKillGame } from "../../hooks/use-launch-game";
import { SubcribeEvents } from "../../../common/subcribe-events";
import { logger } from "../../../common/lib/logger";

export interface IProjectDetailDialogProps {
  server: IAVGServer;
}

export const ProjectDetailDialog = (props: IProjectDetailDialogProps) => {
  const { state, dispatch } = useContext(CreatorContext);
  const [isGameLaunching, setIsGameLaunching] = useState(false);
  const [isGameStatusLoading, setIsGameStatusLoading] = useState(false);

  useEffect(() => {
    const token = PubSub.subscribe(
      SubcribeEvents.GameProcessChanged,
      (event: SubcribeEvents, data: any) => {
        logger.info("Received :", event, data);

        const { status } = data;
        setIsGameLaunching(status === "normal" ? true : false);
      }
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  });

  const renderWebURL = () => {
    const engineURL = GameRunner.getRunningServerURL("Engine");

    if (state.openedProject?.supportBrowser) {
      if (GameRunner.isWebServerRunning("Engine")) {
        return (
          <Button
            minimal={true}
            onClick={() => {
              GameRunner.openInBrowser(engineURL);
            }}
            rightIcon={"share"}
          >
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

  const renderDebugServer = () => {
    if (DebugServer.currentStatus === WSServerStatus.Listening) {
      const address = DebugServer.serverAddress();

      return address;
    }

    return <Tag>调试服务未启动</Tag>;
  };

  const renderVSCode = () => {
    return (
      <ButtonGroup minimal={true}>
        <Button
          className={"path-text"}
          outlined={true}
          fill={true}
          onClick={async () => {
            try {
              if (state.openedProject) {
                await VSCode.run(state.openedProject.dir);
              }
            } catch (error) {
              GUIToaster.show({
                message: error,
                intent: Intent.DANGER,
                timeout: 4000
              });
            }
          }}
        >
          <Icon color={"#51aaec"} component={VSCodeICON}></Icon> 用 VSCode 打开
        </Button>
        <Popover
          position={"bottom"}
          content={
            <Menu>
              <MenuItem icon={"folder-shared-open"} text="打开目录"></MenuItem>
            </Menu>
          }
          target={
            <AnchorButton outlined={true} rightIcon="caret-down"></AnchorButton>
          }
        />
      </ButtonGroup>
    );
  };

  return (
    <Drawer
      isOpen={state.isProjectDetailDialogOpen}
      position={"bottom"}
      size={"90%"}
      isCloseButtonShown={true}
      canOutsideClickClose={false}
      title={"项目详情"}
      hasBackdrop={false}
      autoFocus={true}
      enforceFocus={true}
      usePortal={true}
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
              isGameLaunching ? (
                <BPIcon icon={"play"} />
              ) : (
                <BPIcon icon={"stop"} />
              )
            }
            intent={isGameLaunching ? Intent.SUCCESS : Intent.DANGER}
          >
            {isGameLaunching ? "运行中" : "未运行"}
          </Tag>

          <div className="status-info-container">
            <Row className="info-row">
              <Col span={12}>
                <BugFilled /> 调试服务器
              </Col>
              <Col span={12}>{renderDebugServer()}</Col>
            </Row>
            <Row className="info-row">
              <Col span={12}>
                <BPIcon icon={"code"}></BPIcon> 工程目录
              </Col>
              <Col span={12}>{renderVSCode()}</Col>
            </Row>
            <Row className="info-row">
              <Col span={12}>
                <BPIcon icon={"globe-network"}></BPIcon> 浏览器 URL
              </Col>
              <Col span={12}>{renderWebURL()}</Col>
            </Row>
          </div>
          {/* 
          <div className="options-container">
            <Checkbox checked={true} label="自动刷新" />
            <Checkbox checked={true} label="热加载" />
          </div> */}

          <div className={"buttons-container"}>
            <Button
              fill={true}
              loading={isGameStatusLoading}
              intent={isGameLaunching ? Intent.DANGER : Intent.NONE}
              onClick={async () => {
                try {
                  setIsGameStatusLoading(true);
                  if (state.openedProject) {
                    if (!isGameLaunching) {
                      await useLaunchGame(state.openedProject);
                    } else {
                      await useKillGame();
                    }
                  }
                  setIsGameStatusLoading(false);
                } catch (error) {
                  GUIToaster.show({
                    message: error.message,
                    intent: Intent.DANGER,
                    timeout: 4000
                  });
                }
              }}
            >
              {isGameLaunching ? "终止游戏进程" : "运行游戏"}
            </Button>
          </div>

          {/* <Button fill={true} onClick={async () => {}}>
            打开浏览器
          </Button> */}

          <div className={"footer"}>
            <Row align="middle" justify={"center"}>
              <Col span={20}></Col>
              <Col span={4}>
                <Switch
                  style={{ paddingTop: "17%" }}
                  large={true}
                  checked={state.currentServer.isRunning}
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (state.openedProject) {
                      const checked = e.target.checked;
                      if (checked) {
                        await useServe(state.openedProject, dispatch);
                      } else {
                        await useStopServe(dispatch);
                      }
                    }
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </>
    </Drawer>
  );
};
