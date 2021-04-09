import PubSub from "pubsub-js";

import { Codegen } from "./codegen";
import { GlobalEvents } from "../../global-events";
import { DialogueItem } from "../../../renderer/components/story-items/dialogue/dialogue-item";

import { Story } from "./story";
import { getRandomIntInclusive, randomIn } from "../../utils";
import { ISaveData, StoryItemType } from "../../story-item-type";
import { logger } from "../../lib/logger";
import { StoryItem } from "../../../renderer/components/story-items/story-item";
import { WaitItem } from "../../../renderer/components/story-items/wait/wait-item";
import { SceneItem } from "../../../renderer/components/story-items/scene/scene-item";
import { WorkspaceDebugUI } from "../workspace-debug-ui";
import { GameRunner } from "../game-runner";
import { Workspace } from "../workspace";
import { CharacterItem } from "../../../renderer/components/story-items/character/character-item";
import { SoundItem } from "../../../renderer/components/story-items/sound/sound-item";
import ProjectManagerV2 from "../../manager/project-manager.v2";

export class StoryManager {
  static currentStory: Story = new Story();
  static init() {
    PubSub.subscribe(
      GlobalEvents.StoryItemShouldDelete,
      (message: string, data: { item: DialogueItem; story: Story }) => {
        data.story.remove(data.item.id);

        console.log("items after delete : ", data.story.getAllItems());

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

  static renderStoryItemList(sync: boolean = false) {
    if (sync) {
      PubSub.publishSync(GlobalEvents.StoryItemListShouldRender);
    } else {
      PubSub.publish(GlobalEvents.StoryItemListShouldRender);
    }
  }

  static loadStory() {
    // =====================================================================
    // for test
    // =====================================================================

    const fillRandomData = (v: StoryItem) => {
      switch (v.itemType) {
        case StoryItemType.ShowDialogue: {
          const item = v as DialogueItem;
          item.setText(
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
          break;
        }
        case StoryItemType.Wait: {
          const item = v as WaitItem;
          item.time = getRandomIntInclusive(200, 3000);
        }
        case StoryItemType.Scene: {
          const item = v as SceneItem;
          item.sceneName = randomIn(["三藩市", "米花市", "东京都"]);
        }
      }
    };

    const randomAddItems = (count = 100) => {
      for (let i = 0; i < count; ++i) {
        const v = randomIn([
          new DialogueItem(this.currentStory),
          new SceneItem(this.currentStory),
          new WaitItem(this.currentStory)
        ]);

        fillRandomData(v);
        this.currentStory.addItem(v);
      }
    };

    randomAddItems();

    this.renderStoryItemList();

    WorkspaceDebugUI.registerButton("*测试加载项目", () => {
      ProjectManagerV2.loadProject(
        "/Users/angrypowman/Workspace/Programming/Revisions/avg-plus/game-projects/v2.workspace.example"
      );
    });

    WorkspaceDebugUI.registerButton("生成代码", () => {
      const code = StoryManager.currentStory.getAllItems().map((v) => {
        return Codegen.generate(v.onSave());
      });

      console.log(code.join("\n"));
    });

    WorkspaceDebugUI.registerButton("随机添加一些API", () => {
      randomAddItems(10);
      this.renderStoryItemList();
    });

    WorkspaceDebugUI.registerButton("删除 index-1", () => {
      const item = this.currentStory.getItem(1);
      if (item) {
        this.currentStory.remove(item.id);
      }

      this.renderStoryItemList();
    });

    WorkspaceDebugUI.registerButton("清空剧情", () => {
      this.currentStory.clear();
      this.renderStoryItemList();
    });

    WorkspaceDebugUI.registerButton("添加对话节点", () => {
      const item = new DialogueItem(this.currentStory);
      fillRandomData(item);
      this.currentStory.addItem(item);
      this.renderStoryItemList();
    });

    WorkspaceDebugUI.registerButton("添加延时节点", () => {
      const item = new WaitItem(this.currentStory);
      fillRandomData(item);
      this.currentStory.addItem(item);
      this.renderStoryItemList();
    });

    WorkspaceDebugUI.registerButton("添加对话节点（带立绘）", () => {
      const item = new DialogueItem(this.currentStory);
      const char = new CharacterItem(this.currentStory);
      char.name = randomIn(["林沐风", "学姐"]);
      item.setLinkedCharacter(char);
      fillRandomData(item);
      this.currentStory.addItem(item);
      this.renderStoryItemList();
    });

    WorkspaceDebugUI.registerButton("添加场景节点", () => {
      const item = new SceneItem(this.currentStory);
      fillRandomData(item);
      this.currentStory.addItem(item);
      this.renderStoryItemList();
    });

    WorkspaceDebugUI.registerButton("添加音频", () => {
      const item = new SoundItem(this.currentStory);
      fillRandomData(item);
      this.currentStory.addItem(item);
      this.renderStoryItemList();
    });

    WorkspaceDebugUI.registerButton("运行客户端", () => {
      GameRunner.runAsDesktop(Workspace.getCurrentProject());
    });

    return this.currentStory;
  }

  static selectItem(item: StoryItem) {}
}
