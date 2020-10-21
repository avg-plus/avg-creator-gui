import { v4 as uuidv4 } from "uuid";
import { GlobalEvents } from "../../../common/global-events";
import { StoryItemType } from "../../../common/story-item-type";
import { Story } from "../../services/storyboard/story";

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
  protected _renderHeight: number = 0;

  constructor(story: Story, type: StoryItemType) {
    this._story = story;
    this._itemType = type;
    this.id = uuidv4();
  }

  abstract renderHeight(): number;

  onFocus() {}

  abstract render(): JSX.Element;
  onSave(): any {}
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
}
