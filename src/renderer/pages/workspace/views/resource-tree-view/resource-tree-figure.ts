import { GlobalEvents } from "../../../../../common/global-events";
import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import { AVGTreeNode } from "../../../../../common/models/tree-node";
import { ObservableContext } from "../../../../../common/services/observable-module";
import { StoryItemType } from "../../../../../common/story-item-type";

class ResourceTreeFigure {
  openStory(treeNode: AVGTreeNode) {
    if (treeNode.data.nodeType === ResourceTreeNodeTypes.StoryNode) {
      // const storyData = ProjectManager.openStory(treeNode.data.path);
      // const story = new Story();
      // storyData.stories.forEach((v) => {
      //   switch (v.type as StoryItemType) {
      //     case StoryItemType.ShowDialogue:
      //       const item = new DialogueItem(story);
      //       story.addItem(item);
      //       break;
      //   }
      // });
      // ObservableContext.next(GlobalEvents.OnStoryLoaded, storyData);
    }
  }
}

export default new ResourceTreeFigure();
