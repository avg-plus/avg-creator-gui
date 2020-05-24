/** @format */

import React, { useState, useContext, useEffect } from "react";

import { Empty } from "antd";
import {
  Intent,
  Button,
  ContextMenuTarget,
  ContextMenu,
  Menu
} from "@blueprintjs/core";
import { IPanelProps } from "@blueprintjs/core/lib/esnext";
import { Scrollbars } from "react-custom-scrollbars";

import { ProjectListItem } from "./ProjectListItem";
import { ProjectSettingPanel } from "./ProjectSettingPanel";
import { AVGProjectManager, AVGProjectData } from "../manager/project-manager";
import { CreatorContext } from "../hooks/context";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import styled from "styled-components";

import "./ProjectListMainPanel.less";

const NoProjectHint = styled.label`
  font-size: 16px;
  color: black;
  font-weight: 200;
`;

export const ProjectListMainPanel: React.FC<IPanelProps> = ({ openPanel }) => {
  const { state, dispatch } = useContext(CreatorContext);

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
    openPanel({
      component: ProjectSettingPanel,
      props: { project },
      title: "设置"
    });
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

  const handleCreateProject = async () => {
    dispatch({
      type: AVGCreatorActionType.ToggleCreateProjectDialog,
      payload: {
        open: true
      }
    });
  };

  const contextMenu = () => {
    return (
      <Menu>
        <Menu.Item icon="cog" text="设置" />
      </Menu>
    );
  };

  return (
    <Scrollbars>
      <div
        className="list-container"
        onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.preventDefault();
          dispatch({
            type: AVGCreatorActionType.SelectProjectItem,
            payload: {
              project: null
            }
          });

          ContextMenu.show(contextMenu(), { left: e.clientX, top: e.clientY });
        }}
      >
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
              openSettingsPanel(p);
            }}
            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              event.stopPropagation();
              dispatch({
                type: AVGCreatorActionType.SelectProjectItem,
                payload: {
                  project: p
                }
              });
            }}
            onContextMenu={(
              event: React.MouseEvent<HTMLDivElement, MouseEvent>
            ) => {
              event.stopPropagation();

              dispatch({
                type: AVGCreatorActionType.SelectProjectItem,
                payload: {
                  project: p
                }
              });
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
              <ProjectListItem data={p} dispatch={dispatch} />
            </div>
          </div>
        ))}

        {/* <div className="running-status-info-bar">
        <p className="info">正在监听 http://localhost:2335, 点击打开</p>
      </div> */}
      </div>
    </Scrollbars>
  );
};
