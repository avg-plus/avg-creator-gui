import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../services/storyboard/story";
import { StoryItem } from "../story-item";
import { render } from "./wait-item.component";

export class WaitItem extends StoryItem {
  protected _time: number = 0;

  constructor(story: Story) {
    super(story, StoryItemType.Wait);
  }

  render() {
    return render(this);
  }

  renderHeight(): number {
    return 80;
  }
}
