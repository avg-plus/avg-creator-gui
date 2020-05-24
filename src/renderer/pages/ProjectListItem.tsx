/** @format */

import React, { useState, useContext } from "react";
import "./ProjectListItem.less";
import { Row, Col } from "antd";
import { ContextMenuTarget, Menu, Intent } from "@blueprintjs/core";
import { AVGProjectData, AVGProjectManager } from "../manager/project-manager";
import { CreatorContext } from "../hooks/context";
import {
  AVGCreatorAction,
  AVGCreatorActionType
} from "../redux/actions/avg-creator-actions";
import { GUIToaster } from "../services/toaster";

interface IProjectListItemProps {
  data: AVGProjectData;
  dispatch: any;
}

@ContextMenuTarget
export class ProjectListItem extends React.PureComponent<
  IProjectListItemProps,
  {}
> {
  render() {
    return (
      <Row align={"middle"} justify={"start"}>
        <Col span={6}>
          <div className="cover-image" />
        </Col>
        <Col span={12}>
          <Row justify={"start"}>
            <div className="title">{this.props.data.name}</div>
          </Row>
          <Row justify={"start"}>
            <div className="description">{this.props.data.description}</div>
          </Row>
        </Col>
      </Row>
    );
  }

  renderContextMenu(e: React.MouseEvent<HTMLElement>) {
    const handleDelete = () => {
      console.log("delete item", this.props.data._id);
      AVGProjectManager.deleteProject(this.props.data._id).then((id) => {
        this.props.dispatch({
          type: AVGCreatorActionType.RemoveProjectItem,
          payload: {
            projectID: id
          }
        });

        GUIToaster.show({
          message: "删除成功",
          timeout: 1000,
          intent: Intent.SUCCESS
        });
        return;
      });
    };

    return (
      <Menu>
        <Menu.Item icon="label" text="运行">
          <Menu.Item icon="globe-network" text="浏览器" />
          <Menu.Item icon="desktop" text="PC 桌面" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon="trash" intent="danger" text="打开项目目录" />
        <Menu.Divider />
        <Menu.Item
          icon="trash"
          intent="danger"
          text="删除项目"
          onClick={handleDelete}
        />
        <Menu.Divider />
        <Menu.Item icon="cog" text="设置" />
      </Menu>
    );
  }
}
