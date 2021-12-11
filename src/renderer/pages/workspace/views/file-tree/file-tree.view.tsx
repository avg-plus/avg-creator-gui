import React, { useEffect, useState } from "react";
import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { AVGTreeNodeView } from "./tree-node.view";
import { theme } from "./file-tree.theme";

import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";

import "./file-tree.view.less";
import { Button, ButtonGroup, ContextMenu } from "@blueprintjs/core";
import { FileTreeService } from "./file-tree.service";
import { StoryTreeMenu } from "../../../../components/context-menus/story-tree-menus";
import { useForceUpdate } from "../../../../hooks/use-forceupdate";
import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import { Divider } from "antd";
import { useMount } from "react-use";
import classNames from "classnames";

export const FileTreeView = () => {
  const [treeData, setTreeData] = useState<AVGTreeNodeModel[]>(
    FileTreeService.getTreeItem()
  );
  const [selectedNode, setSelectedNode] = useState<AVGTreeNodeModel | null>();
  const [canAddStoryNode, setCanAddStoryNode] = useState<boolean>();
  const [canAddFolderNode, setCanAddFolderNode] = useState<boolean>();
  const [isInRenameStatusNodeID, setIsInRenameStatusNodeID] =
    useState<string>("");

  useMount(() => {
    const items = FileTreeService.loadFileTree();
    setTreeData(items);
  });

  const handleSelect = (node: AVGTreeNodeModel) => {
    setSelectedNode(node);
  };

  const handleDrop = (
    newTreeData: React.SetStateAction<AVGTreeNodeModel[]>,
    options: any
  ) => {
    setTreeData(newTreeData);
  };

  const handleClickBlank = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setSelectedNode(null);
  };

  const handleTreeContextMenu = (
    event: React.MouseEvent,
    node: AVGTreeNodeModel | null | undefined
  ) => {
    ContextMenu.show(
      <StoryTreeMenu
        node={node}
        onAddFolder={() => {}}
        onAddStory={() => {}}
        onRename={(node) => {
          FileTreeService.setRenameStatus(selectedNode);
          setIsInRenameStatusNodeID(selectedNode ? selectedNode.id : "");
        }}
      />,
      {
        left: event.clientX,
        top: event.clientY
      }
    );
  };

  const hanelRenameEnd = () => {
    setIsInRenameStatusNodeID("");
    FileTreeService.onRenameEnd(selectedNode);
  };

  useEffect(() => {
    if (!selectedNode) {
      setCanAddFolderNode(true);
      setCanAddStoryNode(true);
      return;
    }

    setCanAddFolderNode(selectedNode.type === ResourceTreeNodeTypes.Folder);
    setCanAddStoryNode(true);
  }, [selectedNode]);

  return (
    <div className="container">
      <div className={"toolbar"}>
        <ButtonGroup minimal={false} large={false} vertical={false}>
          <Button text="故事" disabled={!canAddStoryNode} icon="insert" />
          <Button text="目录" disabled={!canAddFolderNode} icon="folder-new" />
        </ButtonGroup>
      </div>

      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <div
            className={classNames(["tree-container"])}
            onClick={(e) => {
              handleClickBlank(e);
            }}
            onMouseDown={(e) => {
              ContextMenu.hide();
              handleClickBlank(e);
            }}
            onContextMenu={(e) => {
              handleTreeContextMenu(e, selectedNode);
            }}
          >
            <Tree<AVGTreeNodeModel>
              tree={treeData}
              rootId={"0"}
              onDrop={handleDrop as any}
              render={(node, { depth, isOpen, onToggle }) => (
                <AVGTreeNodeView
                  node={node as AVGTreeNodeModel}
                  depth={depth}
                  isOpen={isOpen}
                  inEditingNodeID={isInRenameStatusNodeID}
                  isSelected={node.id === selectedNode?.id}
                  onToggle={onToggle}
                  onSelect={handleSelect}
                  onRenameEnd={hanelRenameEnd}
                  onMouseDown={(e, node) => {
                    if (e.button === 2) {
                      ContextMenu.hide();
                      handleSelect(node);
                    }
                  }}
                  onContextMenu={(e) => {
                    handleTreeContextMenu(e, selectedNode);
                  }}
                />
              )}
              // dragPreviewRender={(
              //   monitorProps: DragLayerMonitorProps<AVGTreeNode>
              // ) => <CustomDragPreview monitorProps={monitorProps} />}
              classes={{
                root: "treeRoot",
                draggingSource: "draggingSource",
                dropTarget: "dropTarget"
              }}
            />
          </div>
        </ThemeProvider>
      </StylesProvider>
    </div>
  );
};
