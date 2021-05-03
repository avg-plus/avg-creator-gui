import React, { useState } from "react";
import { ContextMenu, Tab, Tabs } from "@blueprintjs/core";

import SortableTree, {
  ExtendedNodeData,
  NodeData,
  walk,
  TreeItem
} from "react-sortable-tree";
import Scrollbars from "react-custom-scrollbars";

import "./resource-tree-view.less";
import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import { ResourceTreeContextMenu } from "../../../../components/context-menus/resource-tree-menus";

import theme from "./theme";
import { NodeSelectedStatus } from "./select-status";
import { useMount } from "react-use";
import { AVGTreeNode } from "../../../../../common/models/tree-node";
import { GlobalEvents } from "../../../../../common/global-events";
import ResourceTreeFigure from "./resource-tree-figure";
import { ObservableContext } from "../../../../../common/services/observable-module";

export const ResourceTreeView = () => {
  const [treeData, setTreeData] = useState<AVGTreeNode[]>([]);

  useMount(() => {
    ObservableContext.subscribe<TreeItem[]>(
      GlobalEvents.OnProjectLoaded,
      onProjectLoaded
    );
  });

  const onProjectLoaded = (treeItems: AVGTreeNode[]) => {
    setTreeData(treeItems);
  };
  const onChange = (treeData: React.SetStateAction<TreeItem[]>) => {
    setTreeData(treeData as AVGTreeNode[]);
  };

  const renderRowHeight = (info: NodeData): number => {
    const nodeType = info.node.nodeType as ResourceTreeNodeTypes;

    const heightInfos = new Map<ResourceTreeNodeTypes, number>([
      [ResourceTreeNodeTypes.ResourceRootFolder, 32],
      [ResourceTreeNodeTypes.StoryRootFolder, 32],
      [ResourceTreeNodeTypes.StoryNode, 24],
      [ResourceTreeNodeTypes.ScriptNode, 24]
    ]);

    return heightInfos.get(nodeType) ?? 0;
  };

  const handleSelectNode = (
    nodeData: ExtendedNodeData | null,
    focus = true
  ) => {
    walk({
      treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      callback: ({ node }) => {
        node.selected = NodeSelectedStatus.NotSelected;
      },
      ignoreCollapsed: false
    });

    if (nodeData) {
      nodeData.node.selected = focus
        ? NodeSelectedStatus.Selected
        : NodeSelectedStatus.SelectedWithoutFocus;

      ResourceTreeFigure.openStory(nodeData.node as AVGTreeNode);
    } else {
      setTreeData([...treeData]);
    }
  };

  const showTreeContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    node?: TreeItem
  ) => {
    ContextMenu.show(<ResourceTreeContextMenu node={node} />, {
      left: event.clientX,
      top: event.clientY
    });
  };

  const handleGenerateNodeProps = (data: ExtendedNodeData) => {
    return {
      renderNodeIcon: () => {
        const nodeType = data.node.nodeType as ResourceTreeNodeTypes;
        switch (nodeType) {
          case ResourceTreeNodeTypes.StoryRootFolder:
          // return <Icon component={StoryIcon}></Icon>;
          case ResourceTreeNodeTypes.ScriptRootFolder:
          // return <Icon component={ScriptFolderIcon}></Icon>;
        }

        return <></>;
      },
      onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();

        handleSelectNode(data);
        showTreeContextMenu(e, data.node);
      },
      onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();

        handleSelectNode(data);
      }
    };
  };

  const canDrag = (data: ExtendedNodeData) => {
    const nodeType = data.node.nodeType;

    return [
      ResourceTreeNodeTypes.StoryNode,
      ResourceTreeNodeTypes.ScriptNode
    ].includes(nodeType);
  };

  return (
    <>
      <div className={"toolbar"}>
        <Tabs
          animate={true}
          id="TabsExample"
          key={"story-view"}
          vertical={false}
        >
          <Tab
            id="story-view"
            title="故事视图"
            panel={
              <>
                <div
                  className={"tree-wrapper"}
                  onDoubleClick={(e) => {
                    handleSelectNode(null, false);
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    handleSelectNode(null, false);
                    e.stopPropagation();
                  }}
                  onContextMenu={(e) => {
                    showTreeContextMenu(e);
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <Scrollbars
                    className={"scroll-area"}
                    style={{ height: "100%" }}
                    universal={true}
                    autoHideTimeout={1000}
                  >
                    <SortableTree
                      className={"tree"}
                      maxDepth={5}
                      rowHeight={renderRowHeight}
                      treeData={treeData}
                      onChange={onChange}
                      canDrag={canDrag}
                      generateNodeProps={handleGenerateNodeProps}
                      theme={theme}
                      shouldCopyOnOutsideDrop={true}
                      isVirtualized={true}
                    ></SortableTree>
                  </Scrollbars>
                </div>
              </>
            }
          />
          <Tab id="scene-view" title="剧本视图" panel={<></>} />
        </Tabs>
      </div>
    </>
  );
};
