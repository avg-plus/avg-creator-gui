import React, { useState } from "react";

import { ContextMenu, Menu } from "@blueprintjs/core";

import classNames from "classnames";

import "./project-browser-gui.less";

import Icon from "@ant-design/icons";
import { Col, Row } from "antd/lib/grid";
import List from "antd/lib/list";
import Typography from "antd/lib/typography";

import projectIcon from "../../images/icons/project-title.svg";
import { ProjectItemContextMenu } from "../../components/context-menus/project-item-menus";
import {
  ProjectBrowserGUI,
  ProjectBrowserItem,
  ProjectBrowserItemType
} from "./project-browser-gui.service";
import { useMount } from "react-use";

const { Title, Text } = Typography;

export const ProjectBrowserGUIWindow = () => {
  const [activeMenuItem, setActiveMenuItem] =
    useState<ProjectBrowserItemType>("recently-project");

  const [selectedID, setSelectedID] = useState<string>("");

  const [projectItems, setProjectItems] = useState<ProjectBrowserItem[]>();
  const [templateItems, setTemplateItems] = useState<ProjectBrowserItem[]>([]);

  useMount(async () => {
    const projectList = await ProjectBrowserGUI.LoadProjectList();
    setProjectItems(projectList);
  });

  const handleMenuClick = (menuItemType: ProjectBrowserItemType) => {
    setSelectedID("");
    setActiveMenuItem(menuItemType);

    if (menuItemType === "recently-project") {
      setProjectItems([...projectItems]);
    } else {
      setTemplateItems([...templateItems]);
    }
  };

  const handleItemClick = (
    menuItemType: ProjectBrowserItemType,
    item: ProjectBrowserItem
  ) => {
    if (menuItemType === "recently-project") {
      setSelectedID(item.id);
    } else {
      setSelectedID(item.id);
    }
  };

  const handleItemDbClick = (
    menuItemType: ProjectBrowserItemType,
    item: ProjectBrowserItem
  ) => {
    ProjectBrowserGUI.openProject();
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    ContextMenu.show(
      <ProjectItemContextMenu
        onDelete={() => {}}
        onExploreDir={() => {}}
        onOpen={() => ProjectBrowserGUI.openProject()}
      />,
      {
        left: event.clientX,
        top: event.clientY
      }
    );
  };

  return (
    <Row style={{ height: "100%" }}>
      <Col flex={"140px"}>
        <div key="side-menu">
          <div className="side-menu">
            <Menu>
              <Menu.Item
                className={classNames({
                  selected: activeMenuItem === "recently-project"
                })}
                text="最近项目"
                onMouseDown={() => handleMenuClick("recently-project")}
              />
              <Menu.Item
                className={classNames({
                  selected: activeMenuItem === "templates"
                })}
                text="模板库"
                onMouseDown={() => handleMenuClick("templates")}
              />
            </Menu>
          </div>
        </div>
      </Col>
      <Col flex={"720px"}>
        <div key="projects">
          <div className="project-container">
            <Title className="category-title" level={4}>
              {activeMenuItem === "recently-project" ? "最近项目" : "模板库"}
            </Title>
            <List
              grid={{ column: 3 }}
              dataSource={
                activeMenuItem === "recently-project"
                  ? projectItems
                  : templateItems
              }
              renderItem={(item) => (
                <List.Item
                  onMouseDown={() => handleItemClick(activeMenuItem, item)}
                  onDoubleClick={() => handleItemDbClick(activeMenuItem, item)}
                  onContextMenu={(event) => handleContextMenu(event)}
                >
                  <div className="box-wrapper">
                    <div
                      className={classNames("box", {
                        selected: item.id === selectedID
                      })}
                    >
                      <Row justify="center" align="middle">
                        <Col>
                          <Icon
                            component={projectIcon}
                            style={{ fontSize: "24px" }}
                          ></Icon>
                        </Col>

                        <Col>
                          <div className={"title"}>{item.name}</div>
                        </Col>
                      </Row>

                      <div className={"description"}>
                        人可以复仇，但人生不能只剩下复仇，人总有其他活下去的...
                      </div>
                    </div>
                    <div
                      className={classNames("title", {
                        selected: item.id === selectedID
                      })}
                    >
                      白色相簿2
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};
