import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import React from "react";

interface IProjectItemContextMenuProps {
  onDelete: () => void;
  onOpen: () => void;
  onExploreDir: () => void;
  onOpenResource: () => void;
}

export const ProjectItemContextMenu = (props: IProjectItemContextMenuProps) => {
  return (
    <>
      <Menu>
        <MenuItem icon="code" onClick={props.onOpen} text="打开项目" />
        <MenuItem
          icon="database"
          onClick={props.onOpenResource}
          text="打开资源管理"
        />
        <MenuDivider />
        <MenuItem
          icon="trash"
          intent="danger"
          text="删除项目"
          onClick={props.onDelete}
        />
        <MenuDivider />
        <MenuItem
          icon="folder-shared-open"
          onClick={props.onExploreDir}
          text="打开项目目录"
        />
      </Menu>
    </>
  );
};
