import React from "react";
import { AiFillCopy, AiOutlineDelete } from "react-icons/ai";
import { BiCut, BiPaste } from "react-icons/bi";
import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { AVGTreeNodeModel } from "../../../common/models/tree-node-item";
import { ResourceTreeNodeTypes } from "../../../common/models/resource-tree-node-types";
import { Env } from "../../common/remote-objects/remote-env";
import { Nullable } from "../../../common/traits";
import HotKeysManager from "../../common/hotkeys";

interface IResourceTreeContextMenuProps {
  node: AVGTreeNodeModel | null | undefined;
  onAddStory: () => void;
  onAddFolder: () => void;
  onRename: (node: Nullable<AVGTreeNodeModel>) => void;
  onDelete: (node: Nullable<AVGTreeNodeModel>) => void;
}

export const StoryTreeMenu = (props: IResourceTreeContextMenuProps) => {
  const isStoryNode =
    props.node && props.node.type === ResourceTreeNodeTypes.StoryNode;

  const isFolderNode =
    props.node && props.node.type === ResourceTreeNodeTypes.Folder;

  const isRootNode =
    props.node && props.node.type === ResourceTreeNodeTypes.ProjectRoot;

  const canAddStoryNode = isRootNode || isStoryNode || isFolderNode;
  const canAddFolderNode = isRootNode || isFolderNode;
  const canReload = isRootNode || !props.node;

  return (
    <Menu>
      {(canAddStoryNode || canAddFolderNode) && (
        <>
          {canAddStoryNode && (
            <MenuItem
              icon="document"
              text="添加故事"
              onClick={props.onAddStory}
            />
          )}
          {canAddFolderNode && (
            <MenuItem
              icon="folder-new"
              text="添加目录"
              onClick={props.onAddFolder}
            />
          )}
          <MenuDivider />
        </>
      )}

      {(isRootNode || isStoryNode || isFolderNode) && (
        <>
          <MenuItem
            icon="folder-shared-open"
            text={
              Env.getOSName() === "Windows"
                ? "在资源管理器中打开"
                : "在 Finder 中显示"
            }
          />
          {!isRootNode && (
            <>
              <MenuDivider />
              <MenuItem
                text="剪切"
                icon="cut"
                label={HotKeysManager.hotkeyToLabel("Cut")}
              />
              <MenuItem
                text="复制"
                icon="duplicate"
                label={HotKeysManager.hotkeyToLabel("Copy")}
              />
              <MenuItem
                text="粘贴"
                icon="clipboard"
                label={HotKeysManager.hotkeyToLabel("Paste")}
              />
            </>
          )}
          {!isRootNode && (
            <>
              <MenuDivider />
              <MenuItem
                text="重命名"
                icon="edit"
                onClick={() => {
                  props.onRename(props.node);
                }}
              />
              <MenuItem
                intent="danger"
                icon="trash"
                text="删除"
                onClick={() => {
                  props.onDelete(props.node);
                }}
              />
            </>
          )}
        </>
      )}
      {canReload && (
        <>
          {props.node && <MenuDivider />}
          <MenuItem icon="refresh" text="重新载入" />
        </>
      )}
    </Menu>
  );
};
