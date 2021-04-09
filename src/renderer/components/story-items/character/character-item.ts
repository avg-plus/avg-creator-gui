import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../../common/services/storyboard/story";
import { StoryItem } from "../story-item";
import { render } from "./character-item.component";

export class CharacterItem extends StoryItem {
  renderExtendContextMenu(): JSX.Element[] {
    return [];
  }

  private _name: string = "";

  constructor(story: Story) {
    super(story, StoryItemType.Character);
  }

  set name(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  getAvatar() {
    // TODO
    return require("../../../images/fake-data/avatar.png");
  }

  setAvatar() {}

  render() {
    return render(this);
  }

  renderHeight(): number {
    return 40;
  }

  onSave() {
    return super.saveData({
      name: this._name
    });
  }
}
