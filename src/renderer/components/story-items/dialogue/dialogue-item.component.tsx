import classnames from "classnames";
import React, { useRef, useState } from "react";
import { useMount } from "react-use";
import { DialogueItem } from "./dialogue-item";

import "./dialogue-item.component.less";

// import fakeAvatarImage from "../../../images/fake-data/avatar.png";
import { IComponentProps } from "../component-props";
import { MenuItem } from "@blueprintjs/core";

interface IDialogueTextComponentProps extends IComponentProps<DialogueItem> {}

const DialogueItemComponent = (props: IDialogueTextComponentProps) => {
  const [text, setText] = useState(props.item.getText());
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const character = props.item.getLinkedCharacter();
  const isWithCharacter = character !== null;

  useMount(() => {
    props.item.onRefInit(ref);
    props.item.onInputRefInit(inputRef);
  });

  const onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    var clearText = event.clipboardData.getData("text/plain");
    document.execCommand("inserttext", false, clearText);
  };

  const eventProps = {
    onInput: props.item.onChanged.bind(props.item),
    onKeyUp: props.item.onKeyUp.bind(props.item),
    onKeyDown: props.item.onKeyDown.bind(props.item)
  };

  const renderContextLine = () => {
    const item = props.item;

    const isHeadDialogueNode = item.isHeadContextNode();
    const isMiddleDialogue = item.isMiddleContextNode();
    const isEndDialogueNode = item.isTailContextNode();

    return (
      <>
        <div
          className={classnames("context-line", {
            "avatar-node": isWithCharacter,
            "head-dialogue-node": isHeadDialogueNode,
            "middle-dialogue-node": isMiddleDialogue,
            "end-dialogue-node": isEndDialogueNode
          })}
        ></div>

        {!isWithCharacter && (
          <div
            className={classnames("indicator-point", {
              // 是否为结束节点，UI的结束意味着对话不会有向下连接线，逻辑上的结束节点意味着对话会隐藏
              "end-dialogue": isEndDialogueNode && item.isAsEndDialogue()
            })}
          ></div>
        )}
      </>
    );
  };

  return (
    <div
      ref={ref}
      className={classnames("dialogue-item", {
        "avatar-node": isWithCharacter
      })}
    >
      {isWithCharacter && (
        <img className={"character-avatar"} src={character?.getAvatar()}></img>
      )}

      {renderContextLine()}

      <div className={"content"}>
        {isWithCharacter && (
          <div className={"name"}>{isWithCharacter && character?.name}</div>
        )}
        <div
          ref={inputRef}
          className={classnames("edit-content", "text", {
            "avatar-node": isWithCharacter
          })}
          {...eventProps}
          contentEditable={true}
          onPaste={onPaste}
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      </div>

      {props.item.isAsEndDialogue() && (
        <div className="terminal-dialogue-border"></div>
      )}
    </div>
  );
};

export const render = (item: DialogueItem) => {
  return <DialogueItemComponent item={item}></DialogueItemComponent>;
};

export const renderExtendContextMenu = (item: DialogueItem) => {
  const menus: JSX.Element[] = [];
  if (item.isTailContextNode()) {
    if (!item.isAsEndDialogue()) {
      menus.push(
        <MenuItem
          text="设为结束对话"
          onClick={() => item.markAsEndDialogue()}
        />
      );
    } else {
      menus.push(
        <MenuItem
          text="取消结束对话"
          onClick={() => item.markAsEndDialogue(false)}
        />
      );
    }
  }

  return menus;
};
