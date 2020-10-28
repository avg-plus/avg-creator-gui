import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../services/storyboard/story";
import { StoryItem } from "../story-item";
import { render } from "./scene-item.component";

export class SceneItem extends StoryItem {
  constructor(story: Story) {
    super(story, StoryItemType.Scene);
  }

  render() {
    return render(this);
  }

  renderHeight(): number {
    return 40;
  }

  onSave() {
    return {};
  }
}
