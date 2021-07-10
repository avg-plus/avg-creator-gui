import React, { useState } from "react";
import { Col, Row } from "antd/lib/grid";
import {
  MenuDivider,
  Menu,
  MenuItem,
  IconName,
  MaybeElement,
  Icon,
  Button,
  AnchorButton,
  Classes,
  Dialog,
  InputGroup
} from "@blueprintjs/core";
import "./project-resource-page.less";
import {
  ProjectResourceService,
  ResourceItem,
  ProjectResourceType
} from "./project-resource-page.service";
import { useMount } from "react-use";
import classNames from "classnames";

export const ProjectResourcePage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string>("");
  const [resourceItems, setResourceItems] = useState<ResourceItem[]>([]);
  const [classified, setClassified] = useState<ProjectResourceType[]>([]);
  const [unclassified, setUnclassified] = useState<ProjectResourceType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [addTypeName, setAddTempName] = useState<string>("");
  const [isClassified, setIsclassified] = useState<string>("");
  useMount(async () => {
    await reloadResourceTypeList();
  });

  const renderType = (list: ProjectResourceType[]) => {
    return list.map((item) => {
      return (
        <MenuItem
          className={classNames({
            selected: activeMenuItem === item.id
          })}
          id={item.id}
          text={item.name}
          icon={item.icon as IconName | MaybeElement}
          onMouseDown={() => setActiveMenuItem(item.id)}
        />
      );
    });
  };

  const reloadResourceTypeList = async () => {
    const typeList = await ProjectResourceService.loadProjectMenuList();
    setActiveMenuItem(typeList.classified[0].id);
    setClassified([...typeList.classified]);
    setUnclassified([...typeList.unclassified]);
  };

  const openAddTypeDialog = (isClassified: string) => {
    setIsclassified(isClassified);
    setIsOpen(true);
  };

  const submitTypeName = () => {
    if (addTypeName === "") {
      return;
    }
    if (isClassified === "") {
      return;
    }
    ProjectResourceService.insertResourceType(addTypeName, isClassified).then(
      (temp) => {
        if (temp["type"] === "classified") {
          setClassified([
            ...classified,
            {
              id: temp["_id"],
              name: temp["name"],
              icon: temp["icon"],
              type: "classified"
            }
          ]);
        } else {
          setClassified([
            ...unclassified,
            {
              id: temp["_id"],
              name: temp["name"],
              icon: temp["icon"],
              type: "unclassified"
            }
          ]);
        }
      }
    );
  };

  return (
    <Row style={{ height: "100%" }}>
      <Col flex={"20%"}>
        <div key="side-menu">
          <div className="side-menu">
            <Menu>
              <Button
                style={{ margin: "10px 0 10px 0", padding: "5px" }}
                rightIcon="add"
                text="素材集合"
                alignText="left"
                minimal
                fill
                onClick={() => openAddTypeDialog("classified")}
              />
              {renderType(classified)}
              <Button
                style={{
                  margin: "10px 0 10px 0",
                  padding: "5px",
                  borderTop: "1px solid #F0F0F0"
                }}
                rightIcon="add"
                text="智能分类"
                alignText="left"
                onClick={() => openAddTypeDialog("unclassified")}
                minimal
                fill
              />{" "}
              {renderType(unclassified)}
            </Menu>
          </div>
        </div>
      </Col>
      <Col flex={"79%"}>
        <div>asdasd</div>
      </Col>

      <Dialog
        icon="add"
        title="添加"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className={Classes.DIALOG_BODY}>
          <InputGroup
            asyncControl={true}
            large
            leftIcon="filter"
            onChange={(v) => {
              setAddTempName(v.target.value);
            }}
            placeholder="请输入分类名"
            value=""
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <AnchorButton onClick={() => submitTypeName()}>提交</AnchorButton>
          </div>
        </div>
      </Dialog>
    </Row>
  );
};
