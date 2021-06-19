import React, { useState } from "react";

import {
  Alert,
  Icon,
  Button,
  ContextMenu,
  Intent,
  Menu,
  Card
} from "@blueprintjs/core";

import classNames from "classnames";

import "./project-browser-gui.less";

import AntdIcon from "@ant-design/icons";
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
import { GUIAlertDialog } from "../../modals/alert-dialog";

const { Title, Text } = Typography;

export const ProjectBrowserGUIView = () => {
  const [activeMenuItem, setActiveMenuItem] =
    useState<ProjectBrowserItemType>("recently-project");

  const [selectedID, setSelectedID] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<ProjectBrowserItem>();
  const [projectItems, setProjectItems] = useState<ProjectBrowserItem[]>([]);
  const [templateItems, setTemplateItems] = useState<ProjectBrowserItem[]>([]);
  const [isRemoveAlertShow, setIsRemoveAlertShow] = useState(false);

  useMount(async () => {
    // ProjectBrowserGUI.addProject(
    //   "/Users/angrypowman/Workspace/Programming/Revisions/avg-plus/game-projects/v2.workspace.example"
    // );
    await reloadProjectList();
  });

  const reloadProjectList = async () => {
    const projectList = await ProjectBrowserGUI.loadProjectList();
    setProjectItems([
      {
        id: "add-new",
        itemType: "add-new",
        path: "",
        name: "新建项目",
        engineHash: ""
      },
      ...projectList
    ]);
  };

  const handleMenuClick = (menuItemType: ProjectBrowserItemType) => {
    setSelectedID("");
    setActiveMenuItem(menuItemType);

    if (menuItemType === "recently-project") {
      setProjectItems([...projectItems]);
    } else {
      setTemplateItems([...templateItems]);
    }
  };

  const handleClickBlankArea = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((e.target as HTMLDivElement).className.includes("project-container")) {
      setSelectedID("");
    }
  };

  const handleOpenLocalProject = async () => {
    const result = await ProjectBrowserGUI.addLocalProject();
    if (result === "failed") {
      GUIAlertDialog.show({
        text: (
          <>
            <p>打开目录失败，可能所选目录并不是一个合法的项目。</p>
            <p>
              请确保目录下存在 <b>project.avg</b> 文件
            </p>
          </>
        ),
        intent: Intent.DANGER,
        icon: "error"
      });
    } else if (result === "success") {
      await reloadProjectList();
    }
  };

  const handleItemClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    menuItemType: ProjectBrowserItemType,
    item: ProjectBrowserItem
  ) => {
    e.stopPropagation();

    setSelectedID(item.id);
    setSelectedItem(item);
  };

  const handleItemDbClick = (item: ProjectBrowserItem) => {
    ProjectBrowserGUI.openProjectInWorkspace(item);
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ProjectBrowserItem
  ) => {
    ContextMenu.show(
      <ProjectItemContextMenu
        onDelete={async () => {
          ContextMenu.hide();
          setIsRemoveAlertShow(true);
        }}
        onExploreDir={() => {}}
        onOpen={() => ProjectBrowserGUI.openProjectInWorkspace(item)}
      />,
      {
        left: event.clientX,
        top: event.clientY
      }
    );
  };

  const handleDelete = async () => {
    // 等待菜单先隐藏
    if (selectedItem) {
      await ProjectBrowserGUI.removeProject(selectedItem);
      const items = projectItems.filter((v) => {
        return v.id !== selectedItem.id;
      });

      setProjectItems(items);
    }

    setIsRemoveAlertShow(false);
  };

  return (
    <div>
      <Alert
        cancelButtonText="取消"
        confirmButtonText="确认"
        onConfirm={handleDelete}
        onCancel={() => {
          setIsRemoveAlertShow(false);
        }}
        canEscapeKeyCancel={true}
        icon="remove"
        intent={Intent.WARNING}
        isOpen={isRemoveAlertShow}
      >
        <p>
          要从最近项目中移除 <b>{selectedItem?.name}</b> 吗？
        </p>
        <p>此操作不会实际删除您硬盘中的数据</p>
      </Alert>

      <Row style={{ height: "100%" }}>
        <Col flex={"140px"}>
          <div key="side-menu">
            <div className="side-menu">
              <Menu>
                <Menu.Item
                  className={classNames({
                    selected: activeMenuItem === "recently-project"
                  })}
                  text="我的项目"
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
              {activeMenuItem === "recently-project" && (
                <Button
                  className={"btn-open-project"}
                  onClick={handleOpenLocalProject}
                >
                  添加本地项目...
                </Button>
              )}
            </div>
          </div>
        </Col>
        <Col flex={"720px"}>
          <div
            key="projects"
            onMouseDown={(e) => {
              handleClickBlankArea(e);
            }}
          >
            <div className="project-container">
              <Title className="category-title" level={4}>
                {activeMenuItem === "recently-project" ? "我的项目" : "模板库"}
              </Title>
              <List
                grid={{ column: 3 }}
                dataSource={
                  activeMenuItem === "recently-project"
                    ? projectItems
                    : templateItems
                }
                renderItem={(item) => {
                  if (item.itemType === "add-new") {
                    return (
                      <List.Item>
                        <div
                          className="box-wrapper"
                          onMouseDown={(e) =>
                            handleItemClick(e, activeMenuItem, item)
                          }
                        >
                          <div
                            className={classNames("box", "add-new-box", {
                              selected: item.id === selectedID
                            })}
                          >
                            <Icon
                              className="add-new-icon"
                              color="#dcddde"
                              icon="plus"
                              iconSize={80}
                            />
                          </div>
                          <div
                            className={classNames("title", {
                              selected: item.id === selectedID
                            })}
                          >
                            {item.name}
                          </div>
                        </div>
                      </List.Item>
                    );
                  } else {
                    return (
                      <List.Item>
                        <div
                          className="box-wrapper"
                          onMouseDown={(e) =>
                            handleItemClick(e, activeMenuItem, item)
                          }
                          onDoubleClick={() => handleItemDbClick(item)}
                          onContextMenu={(event) =>
                            handleContextMenu(event, item)
                          }
                        >
                          <div
                            className={classNames("box", {
                              selected: item.id === selectedID
                            })}
                          >
                            <Row justify="center" align="middle">
                              <Col>
                                <AntdIcon
                                  component={projectIcon}
                                  style={{ fontSize: "24px" }}
                                ></AntdIcon>
                              </Col>

                              <Col>
                                <div className={"title"}>{item.name}</div>
                              </Col>
                            </Row>

                            <div className={"description"}>
                              {item.description}
                            </div>
                          </div>
                          <div
                            className={classNames("title", {
                              selected: item.id === selectedID
                            })}
                          >
                            {item.name}
                          </div>
                        </div>
                      </List.Item>
                    );
                  }
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
