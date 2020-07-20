import { Menu } from "@blueprintjs/core";
import React from "react";

interface IProjectItemContextMenuProps {
  onDelete: () => void;
  onExploreDir: () => void;
  onOpenInVSCode: () => void;
  onServe: () => void;
}

export const ProjectItemContextMenu = (props: IProjectItemContextMenuProps) => {
  return (
    <>
      <Menu>
        {/* <Menu.Item icon="label" text="运行">
          <Menu.Item icon="globe-network" text="浏览器" />
          <Menu.Item icon="desktop" text="PC 桌面" />
        </Menu.Item> */}
        <Menu.Item icon="applications" onClick={props.onServe} text="运行" />
        <Menu.Item
          icon="code"
          onClick={props.onOpenInVSCode}
          text="在 VSCode 中打开"
        />
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
