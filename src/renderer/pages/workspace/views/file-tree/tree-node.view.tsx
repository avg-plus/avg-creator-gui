import React, { useState } from "react";
import {
  AiFillCaretRight,
  AiTwotoneFolderOpen,
  AiTwotoneFolder
} from "react-icons/ai";

import { FaFileSignature } from "react-icons/fa";

import { useDragOver } from "@minoru/react-dnd-treeview";
import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";

import "./tree-node.less";
import classNames from "classnames";
import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import { EditableText, Label } from "@blueprintjs/core";

type Props = {
  node: AVGTreeNodeModel;
  depth: number;
  isOpen: boolean;
  inEditingNodeID: string;
  isSelected: boolean;
  onSelect: (node: AVGTreeNodeModel) => void;
  onMouseDown: (e: React.MouseEvent, node: AVGTreeNodeModel) => void;
  onContextMenu: (e: React.MouseEvent, node: AVGTreeNodeModel) => void;
  onToggle: (id: AVGTreeNodeModel["id"]) => void;
  onRenameEnd: () => void;
};

export const AVGTreeNodeView: React.FC<Props> = (props) => {
  const { id, droppable, data } = props.node;
  const indent = props.depth * 10;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
    props.onSelect(props.node);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onMouseDown(e, props.node);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    props.onContextMenu(e, props.node);
  };

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  const [renameEditingText, setRenameEditingText] = useState(props.node.text);

  return (
    <div
      className={classNames(
        `tree-node root`,
        { selected: props.isSelected },
        "rename-editing-status",

        {
          "others-in-editing":
            props.inEditingNodeID !== "" &&
            props.inEditingNodeID !== props.node.id
        },
        {
          "in-editing":
            props.inEditingNodeID === "" ||
            props.inEditingNodeID === props.node.id
        }
      )}
      style={{ paddingInlineStart: indent }}
      onClick={handleToggle}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      {...dragOverProps}
    >
      <div className={`${"expandIconWrapper"} ${props.isOpen ? "isOpen" : ""}`}>
        {props.node.type === ResourceTreeNodeTypes.Folder && (
          <AiFillCaretRight size={16}></AiFillCaretRight>
        )}
      </div>
      <div>
        {props.node.type === ResourceTreeNodeTypes.Folder &&
          (props.isOpen ? (
            <AiTwotoneFolderOpen size={20}></AiTwotoneFolderOpen>
          ) : (
            <AiTwotoneFolder size={20}></AiTwotoneFolder>
          ))}

        {props.node.type === ResourceTreeNodeTypes.StoryNode && (
          <FaFileSignature size={16}></FaFileSignature>
        )}
      </div>
      <div className={"labelGridItem"}>
        {props.inEditingNodeID === props.node.id ? (
          <EditableText
            isEditing={true}
            defaultValue={renameEditingText}
            value={renameEditingText}
            onChange={(value: string) => {
              setRenameEditingText(value);
            }}
            onConfirm={(value: string) => {
              setRenameEditingText(value);
              props.node.text = value;
              props.onRenameEnd();
            }}
            onCancel={(value: string) => {
              setRenameEditingText(props.node.text);
              props.onRenameEnd();
            }}
          ></EditableText>
        ) : (
          props.node.text
        )}
      </div>
    </div>
  );
};
