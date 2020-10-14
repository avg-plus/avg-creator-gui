import React, { EventHandler } from "react";
import PubSub from "pubsub-js";

import { render } from "./dialogue-item.component";

import { StoryItem } from "../story-item";
import { GlobalEvents } from "../../../../common/global-events";
import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../services/storyboard/story";

export class DialogueItem extends StoryItem {
  private _text: string = "";

  private _isHeadDialogue = false;
  private _isEndDialogue = false;

  constructor(story: Story) {
    super(story, StoryItemType.Dialogue);
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

  onRefInit(ref: React.RefObject<HTMLDivElement>) {
    if (ref.current) {
      this._ref = ref.current;

      this.moveCaretToEnd();
    }
  }

  onChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this._text = e.target.innerText ?? "";

    PubSub.publish(GlobalEvents.StoryItemContentChanged, this.onSave());
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
    if (this._ref) {
      this._ref.textContent = text;
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
