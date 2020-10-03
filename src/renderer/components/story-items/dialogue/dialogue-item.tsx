import React, { EventHandler } from "react";
import PubSub from "pubsub-js";

import { DialogueItemComponent } from "./dialogue-item.component";

import { StoryItem } from "../story-item";
import { GlobalEvents } from "../../../../common/global-events";
import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../services/storyboard/story";

export class DialogueItem extends StoryItem {
  private _text: string = "";

  constructor(story: Story) {
    super(story, StoryItemType.Dialogue);
  }

  render() {
    return <DialogueItemComponent data={this}></DialogueItemComponent>;
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
    console.log(e.key);

    switch (e.key) {
      case "Backspace":
      case "Delete": {
        if (this.getText().length === 0) {
          // 当文本为空时，删除当前对话
          PubSub.publishSync(GlobalEvents.StoryItemShouldDelete, {
            item: this,
            story: super.getStory()
          });

          // 阻止当前的删除和退格操作，防止在设置焦点后把上一项的最后一个字符删掉
          e.preventDefault();
        }
        break;
      }
      case "Enter": {
        console.log("onKeyPress enter DialogueShouldCreate");

        e.preventDefault();

        // 在下面插入新的对话
        PubSub.publishSync(GlobalEvents.DialogueShouldCreate, {
          item: this,
          story: super.getStory()
        });

        break;
      }
      case "ArrowUp": {
        e.preventDefault();

        PubSub.publishSync(GlobalEvents.StoryItemNavigateTo, {
          item: this,
          story: super.getStory(),
          direction: "up"
        });
        break;
      }
      case "ArrowDown": {
        e.preventDefault();

        PubSub.publishSync(GlobalEvents.StoryItemNavigateTo, {
          item: this,
          story: super.getStory(),
          direction: "down"
        });
        break;
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

  onFocus() {
    console.log("dialogue item focus");
  }

  getText() {
    return this._text;
  }

  onSave() {
    return super.saveData({
      text: this._text
    });
  }
}
