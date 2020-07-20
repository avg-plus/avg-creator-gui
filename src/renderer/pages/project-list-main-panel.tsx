/** @format */

import path from "path";

import React, { useState, useContext, useEffect } from "react";

import { Empty } from "antd";
import {
  Intent,
  Button,
  ContextMenu,
  Navbar,
  Alignment,
  Alert
} from "@blueprintjs/core";
import { IPanelProps } from "@blueprintjs/core/lib/esnext";
import { Scrollbars } from "react-custom-scrollbars";

import { ProjectListItem } from "./project-list-item";
// import { ProjectSettingPanel } from "./project-setting-panel";
import { AVGProjectManager, AVGProjectData } from "../manager/project-manager";
import { CreatorContext } from "../hooks/context";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import styled from "styled-components";

import "./project-list-main-panel.less";
import { ProjectItemContextMenu } from "../components/context-menus/project-item-menus";
import { ProjectListContextMenu } from "../components/context-menus/project-list-menus";
import { GUIToaster } from "../services/toaster";
import { Env } from "../../common/env";
import { shell } from "electron";
import { VSCode } from "../services/vscode";
import { useHotkeys } from "react-hotkeys-hook";
import { GameRunner } from "../services/game-runner";

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

  const handleExploreDir = () => {
    if (!state.selectedProjectItem) {
      return;
    }

    shell.showItemInFolder(state.selectedProjectItem.dir);
  };

  const handleOpenInVSCode = () => {
    if (!state.selectedProjectItem) {
      return;
    }

    try {
      VSCode.run(state.selectedProjectItem.dir);
    } catch (error) {
      GUIToaster.show({ message: error, intent: Intent.DANGER });
    }
  };

  const handleServeProject = () => {
    if (state.selectedProjectItem) {
      if (state.currentServer.isRunning) {
        GameRunner.close();
        dispatch({
          type: AVGCreatorActionType.StartServer,
          payload: {
            serverProject: null,
            isRunning: false
          }
        });
      } else {
        GameRunner.serve(state.selectedProjectItem);
        dispatch({
          type: AVGCreatorActionType.StartServer,
          payload: {
            serverProject: state.selectedProjectItem,
            isRunning: true
          }
        });
      }
    }
  };

  const handleConfirmDelete = () => {
    if (!state.selectedProjectItem) {
      return;
    }

    AVGProjectManager.deleteProject(state.selectedProjectItem._id)
      .then(() => {
        GUIToaster.show({
          message: "删除成功",
          timeout: 2000,
          intent: Intent.SUCCESS
        });
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
            projectID: state.selectedProjectItem?._id
          }
        });

        setIsDeleteConfirmDialogOpen(false);

        dispatch({
          type: AVGCreatorActionType.SelectProjectItem,
          payload: {
            project: null
          }
        });
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
    dispatch({
      type: AVGCreatorActionType.SelectProjectItem,
      payload: {
        project: p
      }
    });
  };

  const isServingProject = (project: AVGProjectData | null) => {
    if (!project) {
      return false;
    }

    return project._id === state.currentServer.serverProject?._id;
  };

  return (
    <>
      {/* <div className="running-status-info-bar">
        <p className="info">正在监听 http://localhost:2335, 点击打开</p>
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
          是否删除项目 <b>{state.selectedProjectItem?.name}</b> ？
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
          dispatch({
            type: AVGCreatorActionType.SelectProjectItem,
            payload: {
              project: null
            }
          });

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
                // openSettingsPanel(p);
              }}
              onClick={(event) => {
                handleSelectItem(event, p);
              }}
              onContextMenu={(event) => {
                handleSelectItem(event, p);

                ContextMenu.show(
                  <ProjectItemContextMenu
                    onDelete={handleAlertDelete}
                    onExploreDir={handleExploreDir}
                    onOpenInVSCode={handleOpenInVSCode}
                    onServe={handleServeProject}
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
                  state.selectedProjectItem &&
                  state.selectedProjectItem._id === p._id
                    ? "selected"
                    : ""
                }`}
              >
                <ProjectListItem projectData={p} />
              </div>
            </div>
          ))}
        </Scrollbars>
      </div>

      {state.projects.length > 0 && (
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            {state.selectedProjectItem && (
              <Button
                icon={
                  isServingProject(state.selectedProjectItem) ? "stop" : "play"
                }
                intent={
                  isServingProject(state.selectedProjectItem)
                    ? Intent.DANGER
                    : Intent.SUCCESS
                }
                text={
                  isServingProject(state.selectedProjectItem) ? "停止" : "运行"
                }
                onClick={() => {}}
              />
            )}
          </Navbar.Group>
        </Navbar>
      )}
    </>
  );
};
