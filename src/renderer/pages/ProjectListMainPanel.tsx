/** @format */

import React, { useState, useContext, useEffect } from "react";
import { Empty } from "antd";
import { ProjectListItem } from "./ProjectListItem";

import "./ProjectListMainPanel.less";
import { IPanelProps } from "@blueprintjs/core/lib/esnext";
import { ProjectSettingPanel } from "./ProjectSettingPanel";
import { AVGProjectManager, AVGProjectData } from "../manager/project-manager";
import { CreatorContext } from "../hooks/context";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import styled from "styled-components";

import { Intent, Button } from "@blueprintjs/core";

export const ProjectListMainPanel: React.FC<IPanelProps> = ({ openPanel }) => {
  const { state, dispatch } = useContext(CreatorContext);

  const openSettingsPanel = (project: AVGProjectData) => {
    openPanel({
      component: ProjectSettingPanel, // <- class or stateless function type
      props: { project }, // <- SettingsPanel props without IPanelProps
      title: "设置" // <- appears in header and back button
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

  const NoProjectHint = styled.label`
    font-size: 16px;
    color: black;
    font-weight: 200;
  `;

  return (
    <div className="list-container">
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
                "开始创建第一个游戏项目吧！"}
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

      {state.projects.map((p: AVGProjectData) => {
        return (
          <div
            key={p.name}
            onDoubleClick={() => {
              openSettingsPanel(p);
            }}
          >
            <ProjectListItem
              key={p.name}
              name={p.name}
              description={p.description ?? ""}
            />
          </div>
        );
      })}

      {/* <div className="running-status-info-bar">
        <p className="info">正在监听 http://localhost:2335, 点击打开</p>
      </div> */}
    </div>
  );
};
