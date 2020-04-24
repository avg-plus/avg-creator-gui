/** @format */

import React, { useState } from "react"
import "./ProjectListItem.less"
import { Row, Col } from "antd"
import { ContextMenuTarget, Menu } from "@blueprintjs/core"

interface IProjectListItemProps {
  name: string
  description: string
}

@ContextMenuTarget
export class ProjectListItem extends React.PureComponent<IProjectListItemProps, {}> {
  render() {
    return (
      <div className="project-list-item">
        <Row align={"middle"} justify={"start"}>
          <Col span={6}>
            <div className="cover-image" />
          </Col>
          <Col span={12}>
            <Row justify={"start"}>
              <div className="title">{this.props.name}</div>
            </Row>
            <Row justify={"start"}>
              <div className="description">{this.props.description}</div>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }

  renderContextMenu(e: React.MouseEvent<HTMLElement>) {
    return (
      <Menu>
        <Menu.Item icon="label" text="运行">
          <Menu.Item icon="globe-network" text="浏览器" />
          <Menu.Item icon="desktop" text="PC 桌面" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon="trash" intent="danger" text="打开项目目录" />
        <Menu.Divider />
        <Menu.Item icon="trash" intent="danger" text="删除项目" />
        <Menu.Divider />
        <Menu.Item icon="cog" text="设置" />
      </Menu>
    )
  }
}
