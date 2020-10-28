import React, { EventHandler } from "react";
import PubSub from "pubsub-js";

import { render } from "./dialogue-item.component";

import { StoryItem } from "../story-item";
import { GlobalEvents } from "../../../../common/global-events";
import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../services/storyboard/story";
import { max } from "underscore";

export class DialogueItem extends StoryItem {
  private _text: string = "";

  private _inputRef: HTMLDivElement;
  private _isHeadDialogue = false;
  private _isEndDialogue = false;
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

  set isHeadDialogue(value: boolean) {
    this._isHeadDialogue = value;
  }

  get isHeadDialogue() {
    return this._isHeadDialogue;
  }

  set isEndDialogue(value: boolean) {
    this._isEndDialogue = value;
  }

  get isEndDialogue() {
    return this._isEndDialogue;
  }

  render() {
    return render(this);
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

    PubSub.publish(GlobalEvents.StoryItemContentChanged, this.onSave());
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

    if (this.isEndDialogue) {
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
