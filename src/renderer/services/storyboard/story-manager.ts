import PubSub from "pubsub-js";

import { Codegen } from "./codegen";
import { GlobalEvents } from "../../../common/global-events";
import { DialogueItem } from "../../components/story-items/dialogue/dialogue-item";

import { Story } from "./story";
import { randomIn } from "../../../common/utils";
import { ISaveData } from "../../../common/story-item-type";
import { logger } from "../../../common/lib/logger";

export class StoryManager {
  static testStory: Story = new Story();
  static init() {
    PubSub.subscribe(
      GlobalEvents.StoryItemShouldDelete,
      (message: string, data: { item: DialogueItem; story: Story }) => {
        data.story.remove(data.item.id);

        // 通知变化更新
        PubSub.publishSync(GlobalEvents.StoryItemListShouldRender);
      }
    );

    // 创建默认的对话
    PubSub.subscribe(
      GlobalEvents.DialogueShouldCreate,
      (message: string, data: { item: DialogueItem; story: Story }) => {
        const item = data.item;
        const story = data.story;

        const index = story.getItemIndex(item);

        const dialogueItem = new DialogueItem(story);
        story.insertAt(index + 1, dialogueItem);

        PubSub.publishSync(GlobalEvents.StoryItemListShouldRender);
      }
    );

    PubSub.subscribe(
      GlobalEvents.StoryItemNavigateTo,
      (
        message: string,
        data: { item: DialogueItem; story: Story; direction: "up" | "down" }
      ) => {
        const item = data.item;
        const story = data.story;

        const index = story.getItemIndex(item);
        const moveIndex = data.direction === "down" ? index + 1 : index - 1;
        const targetItem = story.getItem(moveIndex);

        if (targetItem) {
          targetItem.focus();
        }
      }
    );

    PubSub.subscribe(
      GlobalEvents.StoryItemContentChanged,
      (message: string, saveData: ISaveData) => {
        const codes = this.testStory.getItems().map((v) => {
          return Codegen.generate(v.onSave());
        });

        const code = Codegen.generate(saveData);
        logger.debug("On item content changed: ", code);
      }
    );
  }

  static loadStory() {
    // test
    //for test
    for (let i = 0; i < 100; ++i) {
      const v = new DialogueItem(this.testStory);
      v.setText(
        randomIn([
          "秋深し 隣はなにも しない人",
          "为什么会变成这样呢……第一次有了喜欢的人。有了能做一辈子朋友的人。两件快乐事情重合在一起。而这两份快乐，又给我带来更多的快乐。得到的，本该是像梦境一般幸福的时间……但是，为什么，会变成这样呢……",
          "是我，是我先，明明都是我先来的……接吻也好，拥抱也好，还是喜欢上那家伙也好"
        ])
      );
      this.testStory.addItem(v);
    }

    setTimeout(() => {
      PubSub.publishSync(GlobalEvents.StoryItemListShouldRender);
    }, 1000);

    return this.testStory;
  }
}
