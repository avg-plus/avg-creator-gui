import { trim } from "jquery";
import { StoryItemType } from "../../../../common/story-item-type";
import { Story } from "../../../../common/services/storyboard/story";
import { StoryItem } from "../story-item";
import { render } from "./sound-item.component";

export class SoundItem extends StoryItem {
  renderExtendContextMenu(): JSX.Element[] {
    return [];
  }
  constructor(story: Story) {
    super(story, StoryItemType.Sound);
  }
  // 轨道
  private _track: string = "BGM";
  // 操作
  private _action: string = "播放";
  // url
  private _url: string = "";
  // 音量
  private _volume: number = 50;

  get track() {
    return this._track;
  }

  set track(value: string) {
    if (value != null && trim(value) != "") {
      this._track = value;
    }
  }

  get action() {
    return this._action;
  }

  set action(value: string) {
    if (value != null && trim(value) != "") {
      this._action = value;
    }
  }

  get url() {
    return this._url;
  }

  set url(value: string) {
    if (value != null && trim(value) != "") {
      this._url = value;
    }
  }

  get volume() {
    return this._volume;
  }
  set volume(value: number) {
    if (value < 0 || value > 100) {
      value = 50;
    }
    this._volume = value;
  }
  render() {
    return render(this);
  }

  renderHeight(): number {
    return 40;
  }

  onSave() {
    return super.saveData({
      track: this._track,
      action: this._action,
      url: this._url,
      volume: this._volume
    });
  }
}
