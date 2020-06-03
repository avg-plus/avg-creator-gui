/** @format */

import React from "react";
import "./project-list-item.less";
import { Row, Col } from "antd";
import { AVGProjectData } from "../manager/project-manager";

export interface IProjectListItemProps {
  projectData: AVGProjectData;
}

export const ProjectListItem = (props: IProjectListItemProps) => {
  return (
    <Row align={"middle"} justify={"start"}>
      <Col span={6}>
        <div className="cover-image" />
      </Col>
      <Col span={12}>
        <Row justify={"start"}>
          <div className="title">{props.projectData.name}</div>
        </Row>
        <Row justify={"start"}>
          <div className="description">{props.projectData.description}</div>
        </Row>
      </Col>
    </Row>
  );
};
