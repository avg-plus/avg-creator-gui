import classnames from "classnames";
import React, { useRef, useState } from "react";
import { useMount } from "react-use";
import { DialogueItem } from "./dialogue-item";

import "./dialogue-item.component.less";

import fakeAvatarImage from "../../../images/fake-data/avatar.png";
import { IComponentProps } from "../component-props";
import { StoryItemType } from "../../../../common/story-item-type";
import { StoryItem } from "../story-item";

interface IDialogueTextComponentProps extends IComponentProps<DialogueItem> {}

const DialogueItemComponent = (props: IDialogueTextComponentProps) => {
  const [text, setText] = useState(props.data.getText());
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    props.data.onRefInit(ref);
    props.data.onInputRefInit(inputRef);
  });

  const onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    var clearText = event.clipboardData.getData("text/plain");
    document.execCommand("inserttext", false, clearText);
  };

  const eventProps = {
    onInput: props.data.onChanged.bind(props.data),
    onKeyUp: props.data.onKeyUp.bind(props.data),
    onKeyDown: props.data.onKeyDown.bind(props.data)
  };

  const renderContextLine = () => {
    const prevItem = props.data.getPrevItem();
    const nextItem = props.data.getNextItem();

    const isDialogueItem = (item: StoryItem) => {
      return item.itemType === StoryItemType.ShowDialogue;
    };

    const isHeadDialogueNode =
      (!prevItem || !isDialogueItem(prevItem)) &&
      nextItem &&
      isDialogueItem(nextItem);

    const isMiddleDialogue =
      prevItem &&
      nextItem &&
      prevItem.itemType === StoryItemType.ShowDialogue &&
      nextItem.itemType === StoryItemType.ShowDialogue;

    const isEndDialogueNode =
      prevItem &&
      prevItem.itemType === StoryItemType.ShowDialogue &&
      (!nextItem || nextItem.itemType !== StoryItemType.ShowDialogue);

    return (
      <>
        <div
          className={classnames("context-line", {
            "avatar-node": props.data.isWithCharacter,
            "head-dialogue-node": isHeadDialogueNode,
            "middle-dialogue-node": isMiddleDialogue,
            "end-dialogue-node": isEndDialogueNode
          })}
        ></div>

        {!props.data.isWithCharacter && (
          <div
            className={classnames("indicator-point", {
              // 是否为结束节点，UI的结束意味着对话不会有向下连接线，逻辑上的结束节点意味着对话会隐藏
              "end-dialogue": isEndDialogueNode && props.data.isEndDialogue
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
        "avatar-node": props.data.isWithCharacter
      })}
    >
      {props.data.isWithCharacter && (
        <img className={"character-avatar"} src={fakeAvatarImage}></img>
      )}

      {renderContextLine()}

      <div className={"content"}>
        {props.data.isWithCharacter && <div className={"name"}>林沐风</div>}
        <div
          ref={inputRef}
          className={classnames("edit-content", "text", {
            "avatar-node": props.data.isWithCharacter
          })}
          {...eventProps}
          contentEditable={true}
          onPaste={onPaste}
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      </div>

      {props.data.isEndDialogue && (
        <div className="terminal-dialogue-border"></div>
      )}
    </div>
  );
};

export const render = (data: DialogueItem) => {
  return <DialogueItemComponent data={data}></DialogueItemComponent>;
};
