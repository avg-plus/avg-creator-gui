import React, { Component, Children, cloneElement } from "react";
import classNames from "classnames";

import { TreeRendererProps } from "react-sortable-tree";

import { logger } from "../../../../../../common/lib/logger";

import "./tree-node-renderer.less";
import { NodeSelectedStatus } from "../select-status";

const ResourceTreeThemeTreeNodeRenderer = (props: TreeRendererProps) => {
  const {
    children,
    swapFrom,
    swapLength,
    swapDepth,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop,
    treeIndex,
    treeId,
    listIndex,
    rowDirection,
    getPrevRow, // Delete from otherProps
    node, // Delete from otherProps
    path, // Delete from otherProps
    ...otherProps
  } = props;

  const scaffoldBlockCount = lowerSiblingCounts.length - 1;

  return connectDropTarget(
    <div
      {...otherProps}
      className={classNames("item-container", {
        selected: node.selected !== NodeSelectedStatus.NotSelected,
        unfocus: node.selected === NodeSelectedStatus.SelectedWithoutFocus
      })}
      style={{
        paddingLeft: scaffoldBlockPxWidth * scaffoldBlockCount
      }}
    >
      {Children.map(children, (child) =>
        cloneElement(child, {
          isOver,
          canDrop,
          draggedNode
        })
      )}
    </div>
    // </div>
  );
};

export default ResourceTreeThemeTreeNodeRenderer;
