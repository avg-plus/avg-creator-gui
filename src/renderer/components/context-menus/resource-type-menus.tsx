import { Menu } from "@blueprintjs/core";
import React from "react";

interface IResourceTypeContextMenuProps {
  onDelete: () => void;
  onEdit: () => void;
}

export const ResourceTypeContextMenu = (
  props: IResourceTypeContextMenuProps
) => {
  return (
    <>
      <Menu>
        <Menu.Item icon="edit" onClick={props.onEdit} text="编辑" />
        <Menu.Item
          icon="trash"
          intent="danger"
          text="删除"
          onClick={props.onDelete}
        />
      </Menu>
    </>
  );
};
