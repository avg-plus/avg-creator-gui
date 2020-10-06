import React from "react";
import { Menu } from "@blueprintjs/core";
import { TreeItem } from "react-sortable-tree";

interface IResourceTreeContextMenuProps {
  node?: TreeItem;
}

export const ResourceTreeContextMenu = (
  props: IResourceTreeContextMenuProps
) => {
  return (
    <Menu>
      <>
        <Menu.Item icon="bookmark" text="设为默认" />
        <Menu.Divider />
      </>
      <Menu.Item icon="import" text="下载" />

      <Menu.Item intent="danger" icon="import" text="删除本地文件" />
    </Menu>
  );
};
