import React, { useState } from "react";
import SortableTree, {
  NodeData,
  NodeRendererProps,
  TreeItem
} from "react-sortable-tree";
import fileExplorerTheme from "react-sortable-tree-theme-file-explorer";
import theme from "./theme";

import "./resource-tree-view.less";
import { logger } from "../../../../../common/lib/logger";
import { ResourceTreeNodeTypes } from "../../../../../common/resource-tree-node-types";

const NodeContentRenderer = (props: NodeRendererProps) => {
  let depth = 0;
  const renderNode = (node: TreeItem) => {
    depth++;
    return (
      <div style={{ height: "auto", paddingLeft: depth * 4 }}>
        <div>{node.title}</div>
        {node.children &&
          (node.children as TreeItem[]).map((v) => {
            return renderNode(v);
          })}
      </div>
    );
  };

  return renderNode(props.node);
};

export const ResourceTreeView = () => {
  const [treeData, setTreeData] = useState([
    {
      title: "资源",
      nodeType: ResourceTreeNodeTypes.InternalFolder,
      children: [
        {
          title: "立绘",
          nodeType: ResourceTreeNodeTypes.InternalFolder
        },
        {
          title: "场景",
          nodeType: ResourceTreeNodeTypes.InternalFolder
        },
        {
          title: "其它图形",
          nodeType: ResourceTreeNodeTypes.InternalFolder
        },
        {
          title: "多媒体",
          nodeType: ResourceTreeNodeTypes.InternalFolder
        },
        {
          title: "立绘",
          nodeType: ResourceTreeNodeTypes.InternalFolder
        }
      ]
    },
    {
      title: "剧本",
      nodeType: ResourceTreeNodeTypes.StoryRootFolder,
      children: [
        {
          title: "第一章",
          nodeType: ResourceTreeNodeTypes.StoryNode
        }
      ]
    }
  ]);

  const onChange = (treeData) => {
    setTreeData(treeData);
  };

  const renderRowHeight = (info: NodeData): number => {
    logger.debug("rendering node height: ", info.node.nodeType);

    const nodeType = info.node.nodeType as ResourceTreeNodeTypes;

    const heightInfos = new Map<ResourceTreeNodeTypes, number>([
      [ResourceTreeNodeTypes.InternalFolder, 32],
      [ResourceTreeNodeTypes.StoryRootFolder, 32],
      [ResourceTreeNodeTypes.StoryNode, 24],
      [ResourceTreeNodeTypes.ScriptNode, 24]
    ]);

    return heightInfos.get(nodeType) ?? 0;
  };

  return (
    <div className={"tree-wrapper"}>
      <SortableTree
        maxDepth={5}
        rowHeight={renderRowHeight}
        treeData={treeData}
        onChange={onChange}
        theme={theme}
      ></SortableTree>
    </div>
  );
};
