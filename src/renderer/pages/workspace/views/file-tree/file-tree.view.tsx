import React, { useEffect, useRef, useState } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import {
  Button,
  ButtonGroup,
  ContextMenu,
  Divider,
  Intent
} from "@blueprintjs/core";
import { Classes, Tooltip2 } from "@blueprintjs/popover2";

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
import { WorkspaceContext } from "../../../../modules/context/workspace-context";
import { AVGProject } from "../../../../modules/context/project";

interface FileTreeViewProps {
  project: AVGProject;
}

export const FileTreeView = (props: FileTreeViewProps) => {
  const service = props.project.getTreeService();

  const [treeData, setTreeData] = useState<AVGTreeNodeModel[]>(
    service.getTreeData()
  );
  const [selectedNode, setSelectedNode] = useState<AVGTreeNodeModel | null>();
  const [canAddStoryNode, setCanAddStoryNode] = useState<boolean>();
  const [canAddFolderNode, setCanAddFolderNode] = useState<boolean>();
  const [isInRenameStatusNodeID, setIsInRenameStatusNodeID] =
    useState<string>("");

  useMount(() => {
    reloadTree(true);
  });

  const reloadTree = (force = false) => {
    if (force) {
      const items = service.loadFileTree();
      setTreeData(items);
      return;
    }

    setIsInRenameStatusNodeID("");

    setTreeData(service.getTreeData());
  };

  const handleSelect = (node: AVGTreeNodeModel) => {
    setSelectedNode(node);

    service.openStoryDocument(node);
  };

  const handleNodeToggle = (node: AVGTreeNodeModel, isOpen: boolean) => {
    console.log("handleNodeToggle", node, isOpen);
    node.is_open = isOpen;
  };

  const handleCreateNode = (
    type: ResourceTreeNodeTypes,
    parent: Nullable<AVGTreeNodeModel>
  ) => {
    try {
      const newNode = service.createNode(type, parent, true);

      if (!newNode) {
        return;
      }

      console.log("on create new node: ", type, parent, service.getTreeData());

      setTreeData(service.getTreeData());

      setSelectedNode(newNode);

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
          if (node) {
            service.deleteNode(node);
            setTreeData(service.getTreeData());
          }
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

  const handleRenameEnd = (node: AVGTreeNodeModel, hasUpdated: boolean) => {
    setIsInRenameStatusNodeID("");

    // 名称更改了的情况下才提交更新
    const treeData = service.onRenameEnd(node, hasUpdated);

    // 重新加载
    setTreeData(treeData);

    // 新建节点命名完毕后自动打开 tab
    if (hasUpdated && !node.__shadow__) {
      handleSelect(node);
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
        <ButtonGroup minimal={true} large={false} vertical={false}>
          <>
            <Tooltip2
              hoverOpenDelay={0}
              placement="bottom"
              content={"新建故事"}
            >
              <Button
                disabled={!canAddStoryNode}
                icon="insert"
                onClick={(e) => {
                  handleCreateNode(
                    ResourceTreeNodeTypes.StoryNode,
                    selectedNode
                  );
                }}
              />
            </Tooltip2>
          </>

          <Tooltip2
            disabled={!canAddFolderNode}
            hoverOpenDelay={0}
            placement="bottom"
            content={"新建目录"}
          >
            <Button
              disabled={!canAddFolderNode}
              icon="folder-new"
              onClick={(e) => {
                handleCreateNode(ResourceTreeNodeTypes.Folder, selectedNode);
              }}
            />
          </Tooltip2>
          <Divider></Divider>
          <Tooltip2
            disabled={!canAddFolderNode}
            hoverOpenDelay={0}
            placement="bottom"
            content={"刷新故事树"}
          >
            <Button
              icon="refresh"
              onClick={(e) => {
                reloadTree(true);
              }}
            />
          </Tooltip2>
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
              initialOpen={["root"]}
              render={(node, { depth, isOpen, onToggle }) => (
                <AVGTreeNodeView
                  node={node as AVGTreeNodeModel}
                  depth={depth}
                  isOpen={isOpen}
                  inEditingNodeID={isInRenameStatusNodeID}
                  isSelected={node.id === selectedNode?.id}
                  onToggle={() => {
                    onToggle();
                    // handleNodeToggle(node as AVGTreeNodeModel, isOpen);
                  }}
                  onSelect={handleSelect}
                  onRenameEnd={(hasUpdated) => {
                    handleRenameEnd(node as AVGTreeNodeModel, hasUpdated);
                  }}
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
