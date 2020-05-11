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

export const ProjectListMainPanel: React.FC<IPanelProps> = ({
  openPanel,
  closePanel
}) => {
  // const [projectList, setProjectList] = useState(
  //   AVGProjectManager.loadProjectList()
  // );

  const { state, dispatch } = useContext(CreatorContext);

  const openSettingsPanel = (project: AVGProjectData) => {
    openPanel({
      component: ProjectSettingPanel, // <- class or stateless function type
      props: { project }, // <- SettingsPanel props without IPanelProps
      title: "设置" // <- appears in header and back button
    });
  };

  const handleCreateProject = () => {
    console.log("handleCreateProject");

    dispatch({
      type: AVGCreatorActionType.ToggleCreateProjectDialog,
      payload: {
        open: true
      }
    });
  };

  useEffect(() => {
    // setProjectList(state.projects);
  }, [state.projects]);

  return (
    <div className="list-container">
      {state.projects.length === 0 && (
        <Empty
          // image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
          imageStyle={{
            height: 160
          }}
          description={
            <div className="empty-list-hint">暂时没有任何游戏项目</div>
          }
        >
          <button
            className="bp3-button bp3-icon-add"
            onClick={handleCreateProject}
          >
            创建游戏
          </button>
        </Empty>
      )}

      {state.projects.map((p: AVGProjectData) => {
        return (
          <div
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

      <div className="running-status-info-bar">
        <p className="info">正在监听 http://localhost:2335, 点击打开</p>
      </div>
    </div>
  );
};
