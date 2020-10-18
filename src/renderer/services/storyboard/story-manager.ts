import PubSub from "pubsub-js";

import { Codegen } from "./codegen";
import { GlobalEvents } from "../../../common/global-events";
import { DialogueItem } from "../../components/story-items/dialogue/dialogue-item";

import { Story } from "./story";
import { randomIn } from "../../../common/utils";
import { ISaveData } from "../../../common/story-item-type";
import { logger } from "../../../common/lib/logger";
import { StoryItem } from "../../components/story-items/story-item";

export class StoryManager {
  static currentStory: Story = new Story();
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
        const codes = this.currentStory.getAllItems().map((v) => {
          return Codegen.generate(v.onSave());
        });

        const code = Codegen.generate(saveData);
        logger.debug("On item content changed: ", code);
      }
    );
  }

  static loadStory() {
    // =====================================================================
    // for test
    // =====================================================================
    for (let i = 0; i < 18; ++i) {
      const v = new DialogueItem(this.currentStory);
      v.setText(
        randomIn([
          "记得那天晚上你给我打电话，让我过来找你，声音听起来像是喝了很多酒的样子。",
          "为什么会变成这样呢……第一次有了喜欢的人。有了能做一辈子朋友的人。两件快乐事情重合在一起。而这两份快乐，又给我带来更多的快乐。得到的，本该是像梦境一般幸福的时间……但是，为什么，会变成这样呢……",
          "是我，是我先，明明都是我先来的……接吻也好，拥抱也好，还是喜欢上那家伙也好",
          "那时还是挺担心的，还以为你出了什么事，结果发现没有后就想着跟你做个小恶作剧。",
          "那是我们第一次见面，你当时对《奥赛罗》的见解挺让人印象深刻的。",
          "那就没办法了……就稍稍给你一个提示吧。",
          "——我对你有个愿望……这么说可能有些奇怪，所以应该说是，我对你有所期望吧。",
          "不过话说回来，怎么突然问起我这个了？是想找约会的时间吗？",
          "除了1号的志愿者服务、4号的颁奖，还有毕业前一天的演讲外，其他时间我都有空的。"
        ])
      );
      this.currentStory.addItem(v);
    }

    PubSub.publishSync(GlobalEvents.StoryItemListShouldRender);

    const item = this.currentStory.getItem(0) as DialogueItem;
    item.isHeadDialogue = true;

    [5, 10, 15].forEach((v) => {
      (this.currentStory.getItem(v) as DialogueItem).isEndDialogue = true;
    });
    // =====================================================================

    return this.currentStory;
  }

  static selectItem(item: StoryItem) {}
}