import React from "react";
import {
  AiFillCaretRight,
  AiTwotoneFolderOpen,
  AiTwotoneFolder
} from "react-icons/ai";

import { FaFileSignature } from "react-icons/fa";

import { NodeModel, useDragOver } from "@minoru/react-dnd-treeview";
import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";

import "./tree-node.less";
import classNames from "classnames";
import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";

type Props = {
  node: AVGTreeNodeModel;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onSelect: (node: NodeModel) => void;
  onToggle: (id: NodeModel["id"]) => void;
};

export const AVGTreeNodeView: React.FC<Props> = (props) => {
  const { id, droppable, data } = props.node;
  const indent = props.depth * 10;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
    props.onSelect(props.node);
  };

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  return (
    <div
      className={classNames(`tree-node root`, { selected: props.isSelected })}
      style={{ paddingInlineStart: indent }}
      onClick={handleToggle}
      {...dragOverProps}
    >
      <div className={`${"expandIconWrapper"} ${props.isOpen ? "isOpen" : ""}`}>
        {props.node.droppable && (
          <AiFillCaretRight size={16}></AiFillCaretRight>
        )}
      </div>
      <div>
        {props.node.data?.nodeType === ResourceTreeNodeTypes.Folder &&
          (props.isOpen ? (
            <AiTwotoneFolderOpen size={20}></AiTwotoneFolderOpen>
          ) : (
            <AiTwotoneFolder size={20}></AiTwotoneFolder>
          ))}

        {props.node.data?.nodeType === ResourceTreeNodeTypes.StoryNode && (
          <FaFileSignature size={16}></FaFileSignature>
        )}
      </div>
      <div className={"labelGridItem"}>{props.node.text}</div>
    </div>
  );
};
