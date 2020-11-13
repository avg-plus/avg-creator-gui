import React, { EventHandler } from "react";
import PubSub from "pubsub-js";

import { render, renderExtendContextMenu } from "./dialogue-item.component";

import { StoryItem } from "../story-item";
import { GlobalEvents } from "../../../../common/global-events";
import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../services/storyboard/story";
import { max } from "underscore";

export class DialogueItem extends StoryItem {
  private _text: string = "";

  private _inputRef: HTMLDivElement;

  // 标记是否为逻辑结束对话的节点，如果为 true 则表示对话应该隐藏
  private _asEndDialogueNode = false;

  private _withCharacter = false;

  constructor(story: Story) {
    super(story, StoryItemType.ShowDialogue);
  }

  set isWithCharacter(value: boolean) {
    this._withCharacter = value;
  }

  get isWithCharacter() {
    return this._withCharacter;
  }

  markAsEndDialogue(value: boolean = true) {
    this._asEndDialogueNode = value;
  }

  isAsEndDialogue() {
    return this._asEndDialogueNode;
  }

  render() {
    return render(this);
  }

  renderExtendContextMenu(): JSX.Element[] {
    return renderExtendContextMenu(this);
  }

  static isDialogueItem(item: StoryItem) {
    return item.itemType === StoryItemType.ShowDialogue;
  }

  // 是否为连续对话的开始点
  isHeadContextNode() {
    const prevItem = super.getPrevItem();
    const nextItem = super.getNextItem();

    return (
      (!prevItem || prevItem.itemType !== StoryItemType.ShowDialogue) &&
      nextItem &&
      nextItem.itemType === StoryItemType.ShowDialogue
    );
  }

  // 是否为连续对话的中间节点
  isMiddleContextNode() {
    const prevItem = super.getPrevItem();
    const nextItem = super.getNextItem();

    return (
      prevItem &&
      nextItem &&
      prevItem.itemType === StoryItemType.ShowDialogue &&
      nextItem.itemType === StoryItemType.ShowDialogue
    );
  }

  // 是否为连续对话的结束节点
  isTailContextNode() {
    const prevItem = super.getPrevItem();
    const nextItem = super.getNextItem();

    const isEnd =
      prevItem &&
      prevItem.itemType === StoryItemType.ShowDialogue &&
      (!nextItem || nextItem.itemType !== StoryItemType.ShowDialogue);

    // 如果已经不是结束节点，则取消设为结束对话
    // 防止在中间插入新对话时，仍然渲染结束对话的UI
    if (!isEnd) {
      this.markAsEndDialogue(false);
    }

    return isEnd;
  }

  onInputRefInit(ref: React.RefObject<HTMLDivElement>) {
    if (ref.current) {
      this._inputRef = ref.current;
      this.moveCaretToEnd();
    }
  }

  onRefInit(ref: React.RefObject<HTMLDivElement>) {
    if (ref.current) {
      this._ref = ref.current;
    }
  }

  onChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this._text = e.target.innerText ?? "";

    this.calcHeight();

    PubSub.publishSync(GlobalEvents.StoryItemContentChanged, this.onSave());
    PubSub.publishSync(GlobalEvents.RecomputeStoryNodeHeights, { item: this });
  }

  renderHeight() {
    return this.calcHeight();
  }

  private calcHeight() {
    // 补偿高度
    let compensationHeight = 30;
    let minHeight = 0;

    if (this.isWithCharacter) {
      compensationHeight = 40;
      minHeight = 80;
    }

    if (this.isAsEndDialogue()) {
      compensationHeight = 40;
    }

    // 根据输入文本框重新计算高度
    return Math.max(
      this._inputRef?.clientHeight + compensationHeight,
      minHeight
    );
  }

  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    super.onKeyDown(e);

    if (e.key === "Backspace" || e.key === "Delete") {
      if (this.getText().length === 0) {
        // 当文本为空时，删除当前对话
        PubSub.publishSync(GlobalEvents.StoryItemShouldDelete, {
          item: this,
          story: super.getStory()
        });

        // 阻止当前的删除和退格操作，防止在设置焦点后把上一项的最后一个字符删掉
        e.preventDefault();
      }
    }
  }

  onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {}

  setText(text: string) {
    this._text = text;
    if (this._inputRef) {
      this._inputRef.textContent = text;
    }
  }

  moveCaretToEnd() {
    const target = this._inputRef;

    const range = document.createRange();
    const sel = window.getSelection();
    if (sel) {
      range.selectNodeContents(target);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      target.focus();
      range.detach(); // optimization

      // set scroll to the end if multiline
      target.scrollTop = target.scrollHeight;
    }
  }

  // 重写焦点事件，设置为输入框
  focus() {
    if (this._inputRef) {
      this._inputRef.focus();
      this.onFocus();
    }
  }

  onFocus() {}

  getText() {
    return this._text;
  }

  onSave() {
    return super.saveData({
      text: this._text
    });
  }
}
