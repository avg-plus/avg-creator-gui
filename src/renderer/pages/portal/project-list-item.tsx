/** @format */

import React from "react";
import "./project-list-item.less";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { AVGProjectData } from "../../manager/project-manager";
import DefaultCover from "../../images/default-project-cover.png";

export interface IProjectListItemProps {
  projectData: AVGProjectData;
}

export const ProjectListItem = (props: IProjectListItemProps) => {
  return (
    <Row align={"middle"} justify={"start"}>
      <Col span={6}>
        {/* <div className="cover-image" /> */}
        <img src={DefaultCover} width="70" height="70" />
        {/* <Icon width={"120px"} component={DefaultCover}></Icon> */}
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
