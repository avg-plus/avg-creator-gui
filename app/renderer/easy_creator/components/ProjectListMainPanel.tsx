/** @format */

import React, { useState } from "react"
import { Empty } from "antd"
import { ProjectListItem } from "./ProjectListItem"

import "./ProjectListMainPanel.less"
import { IPanelProps } from "@blueprintjs/core"
import { ProjectSettingPanel } from "./ProjectSettingPanel"
import { AVGProjectManager, AVGProjectData } from "../manager/project-manager"
// import store from "../../redux/store"

export interface ProjectListState {
  projects: AVGProjectData[]
}

export const ProjectListMainPanel: React.FC<IPanelProps> = ({ openPanel, closePanel }) => {
  const [projectList, setProjectList] = useState(AVGProjectManager.loadProjectList())

  const openSettingsPanel = (project: AVGProjectData) => {
    // const [p] = useState(project);

    openPanel({
      component: ProjectSettingPanel, // <- class or stateless function type
      props: { project }, // <- SettingsPanel props without IPanelProps
      title: "设置", // <- appears in header and back button
    })

    // store.dispatch(AVGCreatorAction.openSettingPanel(project));
  }

  return (
    <div className="list-container">
      {projectList.length === 0 && (
        <Empty
          image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
          imageStyle={{
            height: 160,
          }}
          description={<div className="empty-list-hint">呐，暂时没有项目呢！</div>}
        >
          <button className="bp3-button bp3-icon-add">新建项目</button>
        </Empty>
      )}

      {projectList.map((p) => {
        return (
          <div
            onDoubleClick={() => {
              openSettingsPanel(p)
            }}
          >
            <ProjectListItem key={p.name} name={p.name} description={p.description} />{" "}
          </div>
        )
      })}

      <div className="running-status-info-bar">
        <p className="info">正在监听 http://localhost:2335, 点击打开</p>
      </div>
    </div>
  )
}
