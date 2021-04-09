import React from "react";
import classNames from "classnames";
import { isDescendant, NodeRendererProps } from "react-sortable-tree";
import ExpandIcon from "../../../../../images/icons/expand.svg";

import "./node-content-renderer.less";

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
  const onClickEvent = otherProps["onMouseDown"];
  const onContextMenuEvent = otherProps["onContextMenu"];
  const renderNodeIcon = otherProps["renderNodeIcon"] as () => JSX.Element;

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

  const handleExpand = (ignoreExpand = false) => {
    // 在右键菜单动作时，不处理展开/收缩动作
    // 仅调用 toggleChildrenVisibility 触发试图更新
    if (ignoreExpand) {
      node.expanded = !node.expanded;
    }

    toggleChildrenVisibility({
      node,
      path,
      treeIndex
    });
  };

  return (
    <div
      // {...otherProps}
      className={classNames("content-container", className)}
      style={{ width: "100%" }}
      onContextMenu={(e) => {
        onContextMenuEvent(e);
        handleExpand(true);
      }}
      onMouseDown={(e) => {
        onClickEvent(e);
        handleExpand();
      }}
    >
      <span>
        {/* <Icon
          className={classNames(
            "expand-icon",
            { expand: node.expanded },
            { normal: !node.expanded },
            { hidden: !node.children || node.children.length === 0 }
          )}
          component={ExpandIcon}
        ></Icon> */}
      </span>

      {renderNodeIcon && <div className="node-icon">{renderNodeIcon()}</div>}

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

export default ResourceTreeThemeNodeContentRenderer;
