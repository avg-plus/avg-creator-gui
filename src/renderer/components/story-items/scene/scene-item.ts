import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../services/storyboard/story";
import { StoryItem } from "../story-item";
import { render, renderExtendContextMenu } from "./scene-item.component";

export class SceneItem extends StoryItem {
  private _sceneName: string;

  constructor(story: Story) {
    super(story, StoryItemType.Scene);
  }

  get sceneName() {
    return this._sceneName;
  }

  set sceneName(value: string) {
    this._sceneName = value;
  }

  render() {
    return render(this);
  }

  renderExtendContextMenu(): JSX.Element[] {
    return renderExtendContextMenu();
  }

  renderHeight(): number {
    return 80;
  }

  onSave() {
    return {};
  }
}
