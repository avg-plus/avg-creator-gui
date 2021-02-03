/** @format */

import React, { useState, useContext } from "react";
import { useMount } from "react-use";

import { shell } from "electron";

import Empty from "antd/lib/empty";
import { Intent, Button, ContextMenu } from "@blueprintjs/core";
import { Scrollbars } from "react-custom-scrollbars";

import { ProjectListItem } from "./project-list-item";
// import { ProjectSettingPanel } from "./project-setting-panel";
import {
  AVGProjectManager,
  AVGProjectData
} from "../../manager/project-manager";
import { CreatorContext } from "../../hooks/context";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import styled from "styled-components";

import { ProjectItemContextMenu } from "../../components/context-menus/project-item-menus";
import { ProjectListContextMenu } from "../../components/context-menus/project-list-menus";
import { GUIToaster } from "../../services/toaster";
import { VSCode } from "../../services/vscode";

import "./project-list-main-panel.less";
import { TDAPP } from "../../services/td-analytics";
import { logger } from "../../../common/lib/logger";
import { useServe, useStopServe } from "../../hooks/use-serve";
import { GUIAlertDialog } from "../../modals/alert-dialog";
import { WorkspaceLayout } from "../../services/workspace-layout";

const NoProjectHint = styled.label`
  font-size: 16px;
  color: black;
  font-weight: 200;
`;

export default () => {
  const { state, dispatch } = useContext(CreatorContext);
  const [, setIsDeleteConfirmDialogOpen] = useState(false);

  const [seletedItem, setSeletedItem] = useState<AVGProjectData | null>(null);

  useMount(() => {
    AVGProjectManager.loadProjects().then((v) => {
      logger.debug("loaded projects", v);
      dispatch({
        type: AVGCreatorActionType.SetProjectList,
        payload: {
          projects: v
        }
      });
    });
  });

  const handleInitWorkspace = async () => {
    dispatch({
      type: AVGCreatorActionType.OpenSetWorkspaceDialog,
      payload: {
        open: true
      }
    });
    return;
  };

  const handleAlertDelete = async (project: AVGProjectData) => {
    const dialogResult = await GUIAlertDialog.show({
      text: (
        <>
          是否要移除项目 <b>{project.name}</b> ？
        </>
      ),
      icon: "trash",
      checkbox: {
        label: "同时移到回收站",
        defaultChecked: false
      },
      intent: Intent.DANGER,
      confirmButtonText: "移除项目",
      cancelButtonText: "取消"
    });

    if (dialogResult.isConfirm) {
      handleConfirmDelete(dialogResult.isChecked);
    }
  };

  const handleExploreDir = (selectedProjectItem: AVGProjectData) => {
    if (!selectedProjectItem) {
      return;
    }

    shell.showItemInFolder(selectedProjectItem.dir);
  };

  const handleOpenInVSCode = async (selectedProjectItem: AVGProjectData) => {
    if (!selectedProjectItem) {
      return;
    }

    try {
      await VSCode.run(selectedProjectItem.dir);
    } catch (error) {
      GUIToaster.show({ message: error, intent: Intent.DANGER, timeout: 4000 });
    }
  };

  const handleServeProject = async (selectedProjectItem: AVGProjectData) => {
    if (selectedProjectItem) {
      if (state.currentServer.isRunning) {
        await useStopServe(dispatch);
      } else {
        await useServe(selectedProjectItem, dispatch);
      }
    }
  };

  const handleConfirmDelete = (moveToTrash: boolean) => {
    if (!seletedItem) {
      return;
    }

    AVGProjectManager.deleteProject(seletedItem._id, moveToTrash)
      .then(() => {
        if (moveToTrash) {
          GUIToaster.show({
            message: "删除成功，项目已移到回收站。",
            icon: "trash",
            timeout: 2000,
            intent: Intent.SUCCESS
          });
        } else {
          GUIToaster.show({
            message: "项目成功移除。",
            timeout: 2000,
            intent: Intent.SUCCESS
          });
        }

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

  const handleCreateProject = async () => {
    dispatch({
      type: AVGCreatorActionType.OpenCreateProjectDialog,
      payload: {
        open: true,
        mode: "create"
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

  const handleOpenProject = (project: AVGProjectData) => {
    // dispatch({
    //   type: AVGCreatorActionType.OpenProjectDetailDialog,
    //   payload: {
    //     open: true,
    //     project: project
    //   }
    // });

    // v2: Open workspace
    WorkspaceLayout.launchWindow(project);
  };

  return (
    <>
      <div
        className={`list-container`}
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
        onMouseDown={(event) => {
          handleSelectItem(event, null);
        }}
      >
        <Scrollbars style={{ height: "100%" }} autoHide autoHideTimeout={1000}>
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
                handleOpenProject(p);
              }}
              onMouseDown={(event) => {
                handleSelectItem(event, p);
              }}
              onContextMenu={(event) => {
                handleSelectItem(event, p);

                ContextMenu.show(
                  <ProjectItemContextMenu
                    server={state.currentServer}
                    onOpenProjectDetail={() => {
                      handleOpenProject(p);
                    }}
                    onDelete={() => {
                      handleAlertDelete(p);
                    }}
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
