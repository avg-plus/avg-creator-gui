import React, { Component } from "react";
import classNames from "classnames";
import "./node-content-renderer.less";
import { isDescendant, NodeData, NodeRendererProps } from "react-sortable-tree";
import ExpandIcon from "../../../../../images/icons/expand.svg";
import Icon from "@ant-design/icons/lib/components/Icon";

const ResourceTreeThemeNodeContentRenderer = (props: NodeRendererProps) => {
  const {
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop,
    canDrag,
    node,
    title,
    subtitle,
    draggedNode,
    path,
    treeIndex,
    isSearchMatch,
    isSearchFocus,
    icons,
    className,
    style,
    didDrop,
    swapFrom,
    swapLength,
    swapDepth,
    treeId, // Not needed, but preserved for other renderers
    isOver, // Not needed, but preserved for other renderers
    parentNode, // Needed for dndManager
    rowDirection,
    ...otherProps
  } = props;

  let { buttons } = props;

  const nodeTitle = title || node.title;
  const nodeSubtitle = subtitle || node.subtitle;

  buttons = buttons || [];

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;

  const nodeContent = connectDragPreview(
    <div style={{ display: "inline-block" }}>
      <span className={"node-title"}>
        {typeof nodeTitle === "function"
          ? nodeTitle({
              node,
              path,
              treeIndex
            })
          : nodeTitle}
      </span>

      {/* {buttons.length && (
        <div>
          {buttons.map((btn, index) => (
            <div
              key={index} // eslint-disable-line react/no-array-index-key
            >
              {btn}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );

  if (!toggleChildrenVisibility) {
    return <></>;
  }

  return (
    <div
      className="content-container"
      onClick={() =>
        toggleChildrenVisibility({
          node,
          path,
          treeIndex
        })
      }
    >
      {node.children &&
        (node.children.length > 0 || typeof node.children === "function") && (
          <span>
            <Icon
              className={classNames(
                "expand-icon",
                { expand: node.expanded },
                { normal: !node.expanded }
              )}
              color={"#51aaec"}
              component={ExpandIcon}
            ></Icon>

            {/* {node.expanded && !isDragging && (
              <div style={{ width: scaffoldBlockPxWidth }} />
            )} */}
          </span>
        )}

      {canDrag
        ? connectDragSource(nodeContent, { dropEffect: "move" })
        : nodeContent}
    </div>
    // <span
    //   //  style={{ height: "100%" }}
    //   // {...otherProps}
    // onClick={() =>
    //   toggleChildrenVisibility({
    //     node,
    //     path,
    //     treeIndex
    //   })
    // }
    // >
    //   {node.children &&
    //     (node.children.length > 0 || typeof node.children === "function") && (
    //       <span>
    //         {node.expanded ? "-" : "+"}

    //         {/* {node.expanded && !isDragging && (
    //           <div style={{ width: scaffoldBlockPxWidth }} />
    //         )} */}
    //       </span>
    //     )}

    //   <span
    //     // className={
    //     //   styles.row +
    //     //   (isLandingPadActive ? ` ${styles.rowLandingPad}` : "") +
    //     //   (isLandingPadActive && !canDrop ? ` ${styles.rowCancelPad}` : "") +
    //     //   (className ? ` ${className}` : "")
    //     // }
    //     style={{
    //       opacity: isDraggedDescendant ? 0.5 : 1,
    //       paddingLeft: scaffoldBlockPxWidth
    //       // ...style
    //     }}
    //   >
    //     {canDrag
    //       ? connectDragSource(nodeContent, { dropEffect: "copy" })
    //       : nodeContent}
    //   </span>
    // </span>
  );
};

// ResourceTreeThemeNodeContentRenderer.defaultProps = {
//   buttons: [],
//   canDrag: false,
//   canDrop: false,
//   className: "",
//   draggedNode: null,
//   icons: [],
//   isSearchFocus: false,
//   isSearchMatch: false,
//   parentNode: null,
//   style: {},
//   subtitle: null,
//   swapDepth: null,
//   swapFrom: null,
//   swapLength: null,
//   title: null,
//   toggleChildrenVisibility: null,
//   rowDirection: "ltr"
// };

export default ResourceTreeThemeNodeContentRenderer;
