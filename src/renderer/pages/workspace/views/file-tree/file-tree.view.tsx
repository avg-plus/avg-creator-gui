import React, { useEffect, useRef, useState } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { Button, ButtonGroup, ContextMenu, Intent } from "@blueprintjs/core";

import { theme } from "./file-tree.theme";
import { AVGTreeNodeView } from "./tree-node.view";

import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";

import "./file-tree.view.less";
import { FileTreeService } from "./file-tree.service";
import { StoryTreeMenu } from "../../../../components/context-menus/story-tree-menus";
import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import { useMount } from "react-use";
import classNames from "classnames";
import { Nullable } from "../../../../../common/traits";
import { GUIAlertDialog } from "../../../../modals/alert-dialog";

const service = new FileTreeService();

export const FileTreeView = () => {
  const [treeData, setTreeData] = useState<AVGTreeNodeModel[]>(
    service.getTreeData()
  );
  const [selectedNode, setSelectedNode] = useState<AVGTreeNodeModel | null>();
  const [canAddStoryNode, setCanAddStoryNode] = useState<boolean>();
  const [canAddFolderNode, setCanAddFolderNode] = useState<boolean>();
  const [isInRenameStatusNodeID, setIsInRenameStatusNodeID] =
    useState<string>("");

  useMount(() => {
    const items = service.loadFileTree();
    setTreeData(items);
  });

  const handleSelect = (node: AVGTreeNodeModel) => {
    setSelectedNode(node);
  };

  const handleCreateNode = (
    type: ResourceTreeNodeTypes,
    parent: Nullable<AVGTreeNodeModel>
  ) => {
    try {
      const newNode = service.createNode(type, parent);
      if (!newNode) {
        return;
      }

      // 开始重命名模式
      setIsInRenameStatusNodeID(newNode.id);
    } catch (error) {
      GUIAlertDialog.show({ text: error, intent: Intent.DANGER });
    }
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
        onAddFolder={() => {
          handleCreateNode(ResourceTreeNodeTypes.Folder, selectedNode);
        }}
        onAddStory={() => {
          handleCreateNode(ResourceTreeNodeTypes.StoryNode, selectedNode);
        }}
        onRename={(node) => {
          service.setRenameStatus(node);
          setIsInRenameStatusNodeID(node ? node.id : "");
        }}
        onDelete={(node) => {
          service.deleteNode(node);
          setTreeData(service.getTreeData());
        }}
        onReload={() => {
          const treeData = service.loadFileTree();
          setTreeData([]);
          setTreeData(treeData);
        }}
      />,
      {
        left: event.clientX,
        top: event.clientY
      }
    );
  };

  const handleRenameEnd = (hasUpdated: boolean) => {
    setIsInRenameStatusNodeID("");

    // 名称更改了的情况下才提交更新
    if (hasUpdated) {
      service.onRenameEnd(selectedNode);
    }
  };

  useEffect(() => {
    if (!selectedNode) {
      setCanAddFolderNode(true);
      setCanAddStoryNode(true);
      return;
    }

    setCanAddFolderNode(
      selectedNode.type === ResourceTreeNodeTypes.Folder ||
        selectedNode.type === ResourceTreeNodeTypes.ProjectRoot
    );
    setCanAddStoryNode(true);
  }, [selectedNode]);

  const firstUpdate = useRef(true);

  useEffect(() => {
    // 如果不是首次更新
    if (!firstUpdate) {
      console.log("Tree data updated: ", treeData);
      service.updateTreeData(treeData);
    }
  }, [treeData]);

  return (
    <div className="container">
      <div className={"toolbar"}>
        <ButtonGroup minimal={false} large={false} vertical={false}>
          <Button
            text="故事"
            disabled={!canAddStoryNode}
            icon="insert"
            onClick={(e) => {
              handleCreateNode(ResourceTreeNodeTypes.StoryNode, selectedNode);
            }}
          />
          <Button
            text="目录"
            disabled={!canAddFolderNode}
            icon="folder-new"
            onClick={(e) => {
              handleCreateNode(ResourceTreeNodeTypes.Folder, selectedNode);
            }}
          />
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
              rootId={"root"}
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
                  onRenameEnd={handleRenameEnd}
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
