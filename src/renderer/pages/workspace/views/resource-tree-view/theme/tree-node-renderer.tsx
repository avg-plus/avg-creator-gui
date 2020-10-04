import React, { Component, Children, cloneElement } from "react";
import { NodeRendererProps, TreeRendererProps } from "react-sortable-tree";

import "./tree-node-renderer.less";

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

  // return <div>{props.node.title} - tree node renderer</div>;
  return connectDropTarget(
    <div
      {...otherProps}
      // onMouseOver={this.bound.handleMouseOver}
      // onMouseLeave={this.bound.handleMouseLeave}
      className="item-container"
      onFocus={() => {}}
      // className={
      //   styles.node +
      //   (this.state.highlight ? ` ${styles.highlight}` : "") +
      //   (dropType ? ` ${styles[dropType]}` : "")
      // }
    >
      <div
        // className={styles.nodeContent}
        style={{ paddingLeft: scaffoldBlockPxWidth * scaffoldBlockCount }}
      >
        {Children.map(children, (child) =>
          cloneElement(child, {
            isOver,
            canDrop,
            draggedNode
          })
        )}
      </div>
    </div>
  );
};

export default ResourceTreeThemeTreeNodeRenderer;
