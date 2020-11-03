import produce from "immer";
import _ from "underscore";
import { logger } from "../../../common/lib/logger";
import { StoryItemType } from "../../../common/story-item-type";
import { DialogueItem } from "../../components/story-items/dialogue/dialogue-item";
import { StoryItem } from "../../components/story-items/story-item";

export class Story {
  storyItems: StoryItem[] = [];
  selectedItem?: StoryItem;

  constructor() {}

  setSelected(itemOrItemID: StoryItem | string) {
    if (typeof itemOrItemID === "string") {
      this.selectedItem = this.getItemById(itemOrItemID);
    } else {
      this.selectedItem = itemOrItemID;
    }

    console.log("selected item: ", this.selectedItem);
  }

  getSelectedItem() {
    return this.selectedItem;
  }

  addItem(...item: StoryItem[]) {
    // 使用 immer 让返回的数组地址发生变更，便于 React 检测到变化
    this.storyItems = produce(this.storyItems, (draftState) => {
      draftState.push(...item);
    });
  }

  insertAt(index: number = 0, ...item: StoryItem[]) {
    this.storyItems = produce(this.storyItems, (draftState) => {
      draftState.splice(index, 0, ...item);
    });
  }

  clear() {
    this.storyItems = [];
  }

  setItems(...items: StoryItem[]) {
    this.storyItems = items;
  }

  getAllItems() {
    return this.storyItems;
  }

  getItem(indexOrItem: number | StoryItem) {
    if (typeof indexOrItem === "number") {
      return this.storyItems[indexOrItem];
    }

    return this.storyItems.find((v) => {
      return v.id === indexOrItem.id;
    });
  }

  getItemById(id: string) {
    return this.storyItems.find((v) => {
      return v.id === id;
    });
  }

  getItemIndex(item: StoryItem) {
    return _(this.storyItems).indexOf(item);
  }

  remove(id: string) {
    const index = this.storyItems.findIndex((v) => {
      return v.id === id;
    });

    if (index > -1 && this.storyItems.length > 0) {
      this.storyItems = _(this.storyItems).without(this.storyItems[index]);
    }

    let lastIndex = index - 1;
    if (lastIndex < 0) {
      lastIndex = 0;
    }

    const lastItem = this.getItem(lastIndex);
    if (lastItem) {
      lastItem.focus();
      if (lastItem.itemType === StoryItemType.ShowDialogue) {
        (lastItem as DialogueItem).moveCaretToEnd();
      }
    }

    // 如果已经为空，则创建一个默认的对话
    // if (this.storyItems.length === 0) {
    //   this.addItem(new DialogueItem(this));
    // }
  }
}
