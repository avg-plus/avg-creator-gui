import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../../common/services/storyboard/story";
import { StoryItem } from "../story-item";
import { render } from "./wait-item.component";

export class WaitItem extends StoryItem {
  renderExtendContextMenu(): JSX.Element[] {
    return [];
  }

  private _time: number = 0;

  constructor(story: Story) {
    super(story, StoryItemType.Wait);
  }

  set time(value: number) {
    if (value <= 0 || value >= Number.MAX_SAFE_INTEGER) {
      value = 1000;
    }

    this._time = value;
  }

  get time() {
    return this._time;
  }

  render() {
    return render(this);
  }

  renderHeight(): number {
    return 40;
  }

  onSave() {
    return super.saveData({
      time: this._time
    });
  }
}
