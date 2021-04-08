import React, { useState } from "react";
import SortableTree, {
  ExtendedNodeData,
  NodeData,
  walk,
  TreeItem
} from "react-sortable-tree";
import Scrollbars from "react-custom-scrollbars";

import "./resource-tree-view.less";
import { ResourceTreeNodeTypes } from "../../../../../common/resource-tree-node-types";
import { ContextMenu, Tab, Tabs, Icon } from "@blueprintjs/core";
import { ResourceTreeContextMenu } from "../../../../components/context-menus/resource-tree-menus";

// Icons
// import Icon from "@ant-design/icons/lib/components/Icon";
import StoryIcon from "../../../../images/icons/write.svg";
import ScriptFolderIcon from "../../../../images/icons/script.svg";
import AddNodeIcon from "../../../../images/icons/add-node.svg";
import BookIcon from "../../../../images/icons/book.svg";

import theme from "./theme";
import { DefaultTreeNodes } from "../../../../../common/default-tree-nodes";
import { NodeSelecteStatus } from "./select-status";
import { autoSubScribe } from "../../../../../common/utils";

export const ResourceTreeView = () => {
  const [treeData, setTreeData] = useState<TreeItem[]>(DefaultTreeNodes);

  autoSubScribe();

  const onChange = (treeData: React.SetStateAction<TreeItem[]>) => {
    setTreeData(treeData);
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

  const handleSelectNode = (data: ExtendedNodeData | null, focus = true) => {
    walk({
      treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      callback: ({ node }) => {
        node.selected = NodeSelecteStatus.NotSelected;
      },
      ignoreCollapsed: false
    });

    if (data) {
      data.node.selected = focus
        ? NodeSelecteStatus.Selected
        : NodeSelecteStatus.SelectedWithoutFocus;
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
          <Tab id="story-view" title="故事视图" panel={<></>} />
          <Tab id="scene-view" title="剧本视图" panel={<></>} />
        </Tabs>
      </div>
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
            isVirtualized={false}
          ></SortableTree>
        </Scrollbars>
      </div>
    </>
  );
};
