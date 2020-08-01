/** @format */

import React, { useState, useContext, useEffect } from "react";

import Empty from "antd/lib/empty";
import {
  Intent,
  Button,
  ContextMenu,
  Navbar,
  Alignment,
  Alert
} from "@blueprintjs/core";
import { Scrollbars } from "react-custom-scrollbars";

import { ProjectListItem } from "./project-list-item";
// import { ProjectSettingPanel } from "./project-setting-panel";
import { AVGProjectManager, AVGProjectData } from "../manager/project-manager";
import { CreatorContext } from "../hooks/context";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import styled from "styled-components";

import { ProjectItemContextMenu } from "../components/context-menus/project-item-menus";
import { ProjectListContextMenu } from "../components/context-menus/project-list-menus";
import { GUIToaster } from "../services/toaster";
import { Env } from "../../common/env";
import { shell } from "electron";
import { VSCode } from "../services/vscode";
import { useHotkeys } from "react-hotkeys-hook";
import { GameRunner } from "../services/game-runner";
import { useForceUpdate } from "../hooks/use-forceupdate";

import "./project-list-main-panel.less";
import { TDAPP } from "../services/td-analytics";

const NoProjectHint = styled.label`
  font-size: 16px;
  color: black;
  font-weight: 200;
`;

export const ProjectListMainPanel = () => {
  const { state, dispatch } = useContext(CreatorContext);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(
    false
  );

  const [seletedItem, setSeletedItem] = useState<AVGProjectData | null>(null);

  useEffect(() => {
    AVGProjectManager.loadProjects().then((v) => {
      console.log("loaded projects", v);

      dispatch({
        type: AVGCreatorActionType.SetProjectList,
        payload: {
          projects: v
        }
      });
    });
  }, []);

  const openSettingsPanel = (project: AVGProjectData) => {
    // openPanel({
    //   component: ProjectSettingPanel,
    //   props: { project },
    //   title: "设置"
    // });
  };

  const handleInitWorkspace = async () => {
    dispatch({
      type: AVGCreatorActionType.ToggleSetWorkspaceDialog,
      payload: {
        open: true
      }
    });
    return;
  };

  const handleAlertDelete = () => {
    setIsDeleteConfirmDialogOpen(true);
  };

  const handleExploreDir = (selectedProjectItem: AVGProjectData) => {
    if (!selectedProjectItem) {
      return;
    }

    shell.showItemInFolder(selectedProjectItem.dir);
  };

  const handleOpenInVSCode = (selectedProjectItem: AVGProjectData) => {
    if (!selectedProjectItem) {
      return;
    }

    try {
      VSCode.run(selectedProjectItem.dir);
    } catch (error) {
      GUIToaster.show({ message: error, intent: Intent.DANGER, timeout: 4000 });
    }
  };

  const handleServeProject = async (selectedProjectItem: AVGProjectData) => {
    if (selectedProjectItem) {
      if (state.currentServer.isRunning) {
        GameRunner.close();
        GUIToaster.show({
          message: "停止服务",
          intent: Intent.WARNING
        });
        dispatch({
          type: AVGCreatorActionType.StartServer,
          payload: {
            serverProject: null,
            isRunning: false
          }
        });
      } else {
        try {
          const serverStatus = await GameRunner.serve(selectedProjectItem);

          if (serverStatus) {
            GUIToaster.show({
              message: "开启服务成功",
              intent: Intent.SUCCESS
            });
          }

          dispatch({
            type: AVGCreatorActionType.StartServer,
            payload: {
              serverProject: selectedProjectItem,
              isRunning: true
            }
          });
        } catch (error) {
          GUIToaster.show({
            message: "启动服务错误：" + error.toString(),
            intent: Intent.DANGER
          });
        }
      }
    }
  };

  const handleConfirmDelete = () => {
    if (!seletedItem) {
      return;
    }

    AVGProjectManager.deleteProject(seletedItem._id)
      .then(() => {
        GUIToaster.show({
          message: "删除成功",
          timeout: 2000,
          intent: Intent.SUCCESS
        });

        TDAPP.onEvent("删除项目", "删除项目", seletedItem);
      })
      .catch((error) => {
        GUIToaster.show({
          message: error,
          timeout: 2000,
          intent: Intent.DANGER
        });
      })
      .finally(() => {
        dispatch({
          type: AVGCreatorActionType.RemoveProjectItem,
          payload: {
            projectID: seletedItem?._id
          }
        });

        setIsDeleteConfirmDialogOpen(false);

        setSeletedItem(null);
      });
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmDialogOpen(false);
  };

  const handleCreateProject = async () => {
    dispatch({
      type: AVGCreatorActionType.ToggleCreateProjectDialog,
      payload: {
        open: true
      }
    });
  };

  const handleSelectItem = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    p: AVGProjectData | null
  ) => {
    event.stopPropagation();

    setSeletedItem(p);
  };

  const isServingProject = (project: AVGProjectData | null) => {
    if (!project) {
      return false;
    }

    return project._id === state.currentServer.serveProject?._id;
  };

  return (
    <>
      {/* <div className="server-toolbar">
        <Button
          icon={isServingProject(seletedItem) ? "stop" : "play"}
          intent={
            isServingProject(seletedItem) ? Intent.DANGER : Intent.SUCCESS
          }
          text={isServingProject(seletedItem) ? "停止" : "运行"}
          onClick={() => {}}
        />
      </div> */}

      <Alert
        cancelButtonText="取消"
        confirmButtonText="移到回收站"
        icon="trash"
        canOutsideClickCancel={false}
        intent={Intent.DANGER}
        isOpen={isDeleteConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        canEscapeKeyCancel={true}
        style={{ width: "86%" }}
      >
        <p>
          是否删除项目 <b>{seletedItem?.name}</b> ？
        </p>
      </Alert>

      <div
        className="list-container"
        onContextMenu={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
          if (state.projects.length === 0) {
            return;
          }
          event.preventDefault();

          setSeletedItem(null);

          ContextMenu.show(<ProjectListContextMenu dispatch={dispatch} />, {
            left: event.clientX,
            top: event.clientY
          });
        }}
        onClick={(event) => {
          handleSelectItem(event, null);
        }}
      >
        <Scrollbars>
          {state.projects.length === 0 && (
            <Empty
              imageStyle={{
                height: 160
              }}
              description={
                <NoProjectHint>
                  {!AVGProjectManager.isWorkspaceInit() &&
                    "设置一个目录，用于储存你的游戏项目"}
                  {AVGProjectManager.isWorkspaceInit() &&
                    "使用 AVGPlus 开发你的第一个文字冒险游戏"}
                </NoProjectHint>
              }
            >
              {!AVGProjectManager.isWorkspaceInit() && (
                <Button
                  className="bp3-icon-inbox"
                  intent={Intent.PRIMARY}
                  onClick={handleInitWorkspace}
                >
                  初始化工作目录
                </Button>
              )}

              {AVGProjectManager.isWorkspaceInit() && (
                <Button className="bp3-icon-add" onClick={handleCreateProject}>
                  创建游戏
                </Button>
              )}
            </Empty>
          )}

          {state.projects.map((p: AVGProjectData) => (
            <div
              key={p._id}
              onDoubleClick={() => {
                dispatch({
                  type: AVGCreatorActionType.OpenProjectDetailDialog,
                  payload: {
                    open: true,
                    project: p
                  }
                });
              }}
              onClick={(event) => {
                handleSelectItem(event, p);
              }}
              onContextMenu={(event) => {
                handleSelectItem(event, p);

                ContextMenu.show(
                  <ProjectItemContextMenu
                    server={state.currentServer}
                    onDelete={handleAlertDelete}
                    onExploreDir={() => {
                      handleExploreDir(p);
                    }}
                    onOpenInVSCode={() => {
                      handleOpenInVSCode(p);
                    }}
                    onServe={() => {
                      handleServeProject(p);
                    }}
                  />,
                  {
                    left: event.clientX,
                    top: event.clientY
                  }
                );
              }}
            >
              <div
                className={`project-list-item ${
                  seletedItem && seletedItem._id === p._id ? "selected" : ""
                }`}
              >
                <ProjectListItem projectData={p} />
              </div>
            </div>
          ))}
        </Scrollbars>
      </div>
    </>
  );
};
