import { Menu } from "@blueprintjs/core";
import React from "react";

interface IProjectItemContextMenuProps {
  onDelete: () => void;
  onOpen: () => void;
  onExploreDir: () => void;
}

export const ProjectItemContextMenu = (props: IProjectItemContextMenuProps) => {
  return (
    <>
      <Menu>
        <Menu.Item icon="code" onClick={props.onOpen} text="打开项目" />
        <Menu.Divider />
        <Menu.Item
          icon="trash"
          intent="danger"
          text="删除项目"
          onClick={props.onDelete}
        />
        <Menu.Divider />
        <Menu.Item
          icon="folder-shared-open"
          onClick={props.onExploreDir}
          text="打开项目目录"
        />
      </Menu>
    </>
  );
};
