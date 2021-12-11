import React from "react";
import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { AVGTreeNodeModel } from "../../../common/models/tree-node-item";
import { ResourceTreeNodeTypes } from "../../../common/models/resource-tree-node-types";
import { Env } from "../../common/remote-objects/remote-env";

interface IResourceTreeContextMenuProps {
  node: AVGTreeNodeModel | null | undefined;
  onAddStory: () => void;
  onAddFolder: () => void;
  onRename: (node: AVGTreeNodeModel) => void;
}

export const StoryTreeMenu = (props: IResourceTreeContextMenuProps) => {
  return (
    <Menu>
      {props.node && props.node.type === ResourceTreeNodeTypes.Folder && (
        <>
          <MenuItem icon="add" text="添加故事" onClick={props.onAddStory} />
          <MenuItem
            icon="folder-new"
            text="添加目录"
            onClick={props.onAddFolder}
          />
          <MenuDivider />
        </>
      )}

      {((props.node && props.node.type === ResourceTreeNodeTypes.Folder) ||
        (props.node &&
          props.node.type === ResourceTreeNodeTypes.StoryNode)) && (
        <>
          <MenuItem
            icon="folder-shared-open"
            text={
              Env.getOSName() === "Windows"
                ? "在资源管理器中打开"
                : "在 Finder 中显示"
            }
          />
          <MenuDivider />
          <MenuItem text="剪切" />
          <MenuItem text="复制" />
          <MenuItem text="粘贴" />
          <MenuDivider />
          <MenuItem text="重命名" onClick={props.onRename} />
          <MenuItem intent="danger" icon="delete" text="删除" />
          <MenuDivider />
        </>
      )}
      <MenuItem icon="refresh" text="重新载入" />
    </Menu>
  );
};
