import { v4 as uuidv4 } from "uuid";
import { GlobalEvents } from "../../../common/global-events";
import { StoryItemType } from "../../../common/story-item-type";
import { Story } from "../../../common/models/story";

interface IStoryItem {
  render(): JSX.Element;
  onRefInit(ref: React.RefObject<HTMLDivElement>): void;
  onChanged(e: React.ChangeEvent<HTMLInputElement>): void;
  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void;
  onKeyUp(e: React.KeyboardEvent<HTMLInputElement>): void;
  onFocus(): void;
  onSave(): any;
}

export abstract class StoryItem implements IStoryItem {
  readonly id: string = uuidv4();
  private _story: Story;
  protected _ref!: HTMLDivElement;
  private _itemType: StoryItemType = StoryItemType.None;
  public selected = false;

  constructor(story: Story, type: StoryItemType) {
    this._story = story;
    this._itemType = type;
    this.id = uuidv4();
  }

  public depth = 0;

  getElementId() {
    return `item_${this.itemType}_${this.id}`;
  }

  abstract render(): JSX.Element;
  abstract renderExtendContextMenu(): JSX.Element[];
  abstract renderHeight(): number;
  abstract onSave(): any;

  get itemType() {
    return this._itemType;
  }

  onFocus() {}
  onBlur() {}
  onRefInit(ref: React.RefObject<HTMLDivElement>): void {}
  onChanged(e: React.ChangeEvent<HTMLInputElement>): void {}

  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Control + ↑ ： 移动到上一个 Item
    if (e.shiftKey && e.key === "ArrowUp") {
      PubSub.publishSync(GlobalEvents.StoryItemNavigateTo, {
        item: this,
        story: this.getStory(),
        direction: "up"
      });
    }
    // Control + ↓ ： 移动到上一个 Item
    else if (e.shiftKey && e.key === "ArrowDown") {
      PubSub.publishSync(GlobalEvents.StoryItemNavigateTo, {
        item: this,
        story: this.getStory(),
        direction: "down"
      });
    }
    // Enter: 创建下一个对话
    else if (e.key === "Enter") {
      console.log("onKeyPress enter DialogueShouldCreate");

      e.preventDefault();

      // 在下面插入新的对话
      PubSub.publishSync(GlobalEvents.DialogueShouldCreate, {
        item: this,
        story: this.getStory()
      });
    }
  }

  onKeyUp(e: React.KeyboardEvent<HTMLInputElement>): void {}

  getStory() {
    return this._story;
  }

  getPrevItem() {
    const index = this._story.getItemIndex(this);
    const prevIndex = index - 1;

    if (prevIndex >= 0) {
      const prevItem = this._story.getItem(prevIndex);
      if (prevItem) {
        return prevItem;
      }
    }

    return null;
  }

  getNextItem() {
    const index = this._story.getItemIndex(this);
    const nextIndex = index + 1;
    if (nextIndex >= 0) {
      const nexItem = this._story.getItem(nextIndex);
      if (nexItem) {
        return nexItem;
      }
    }

    return null;
  }

  onDrop() {}

  blur() {
    if (this._ref) {
      this._ref.blur();
      console.log("set blur ", this);

      this.onBlur();
    }
  }

  focus() {
    if (this._ref) {
      this._ref.focus();
      console.log("set focus ", this);

      this.onFocus();
    }
  }

  getRef() {
    return this._ref;
  }

  abstract parseFrom(data: any): void;

  saveData(data: any) {
    return {
      type: this._itemType,
      data: {
        ...data
      }
    };
  }
}
