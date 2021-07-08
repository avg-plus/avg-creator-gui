import React, { useState } from "react";
import { Col, Row } from "antd/lib/grid";
import {
  MenuDivider,
  Menu,
  MenuItem,
  IconName,
  MaybeElement
} from "@blueprintjs/core";
import "./project-resource-page.less";
import {
  ProjectResourceService,
  ResourceItem,
  ProjectResourceType
} from "./project-resource-page.service";
import { useMount } from "react-use";

export const ProjectResourcePage = () => {
  const [resourceItems, setResourceItems] = useState<ResourceItem[]>([]);
  const [classified, setClassified] = useState<ProjectResourceType[]>([]);
  const [unclassified, setUnclassified] = useState<ProjectResourceType[]>([]);

  useMount(async () => {
    await reloadResourceTypeList();
  });

  const renderType = (list: ProjectResourceType[]) => {
    return (
      <div>
        {list.map((item) => {
          return (
            <MenuItem
              id={item.id}
              text={item.name}
              icon={item.icon as IconName | MaybeElement}
            />
          );
        })}
      </div>
    );
  };

  const reloadResourceTypeList = async () => {
    const typeList = await ProjectResourceService.loadProjectMenuList();
    setClassified([...typeList.classified]);
    setUnclassified([...typeList.unclassified]);
  };

  return (
    <Row style={{ height: "100%" }}>
      <Col flex={"140px"}>
        <div key="side-menu">
          <div className="side-menu">
            <Menu>
              <MenuDivider title="素材集合" />
              {renderType(classified)}
              <MenuDivider title="智能集合" />
              {renderType(unclassified)}
            </Menu>
          </div>
        </div>
      </Col>
      <Col flex={"700px"}>
        <div>asdasd</div>
      </Col>
    </Row>
  );
};
