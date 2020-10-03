import { v4 as uuidv4 } from "uuid";
import { StoryItemType } from "../../../common/story-item-type";
import { Story } from "../../services/storyboard/story";

interface IStoryItem {
  onFocus(): void;
}

export abstract class StoryItem implements IStoryItem {
  readonly id: string = uuidv4();
  private _story: Story;
  protected _ref!: HTMLDivElement;
  private _itemType: StoryItemType = StoryItemType.None;

  constructor(story: Story, type: StoryItemType) {
    this._story = story;
    this._itemType = type;
    this.id = uuidv4();
  }

  onFocus() {}

  abstract render(): JSX.Element;
  abstract onSave(): any;

  getStory() {
    return this._story;
  }

  focus() {
    if (this._ref) {
      this._ref.focus();
      this.onFocus();
    }
  }

  saveData(data: any) {
    return {
      type: this._itemType,
      data: {
        ...data
      }
    };
  }

  moveCaretToEnd() {
    const target = this._ref;

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
}
