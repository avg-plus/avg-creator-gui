import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../services/storyboard/story";
import { StoryItem } from "../story-item";
import { render } from "./template-item.component";

export class TemplateItem extends StoryItem {
  constructor(story: Story) {
    super(story, StoryItemType.None);
  }

  render() {
    return render(this);
  }

  renderExtendContextMenu(): JSX.Element[] {
    throw new Error("Method not implemented.");
  }

  renderHeight(): number {
    return 100;
  }

  onSave() {
    return {};
  }
}
