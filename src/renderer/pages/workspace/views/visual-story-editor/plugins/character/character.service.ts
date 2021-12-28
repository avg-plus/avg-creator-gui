import { APICharacterData } from "../../../../../../../common/models/character";
import { EditorService } from "../../editor-service";
import { CEBlockService, ServiceStateContext } from "../ce-block-service";

export class APICharacterBlockService extends CEBlockService<APICharacterData> {
  private _characterData: APICharacterData;
  private _avatarThumbnail: ServiceStateContext<string>;
  private _charaterName: ServiceStateContext<string>;
  private _isSelected: ServiceStateContext<boolean>;

  onBlockInit() {
    const debugCharacterCached = localStorage.getItem("debug_cached_avatar");

    if (debugCharacterCached) {
      const parsedDebugCharacterCached = JSON.parse(debugCharacterCached);

      const data = new APICharacterData();
      data.character_id = parsedDebugCharacterCached.character_id;
      data.avatarPath = parsedDebugCharacterCached.avatarPath;
      data.thumbnailData = parsedDebugCharacterCached.thumbnailData;
      data.name = parsedDebugCharacterCached.name;

      this.setCharacterData(data);
    }
  }

  onBlockClicked() {}

  onBlockFocus() {
    this._isSelected.setValue(true);
  }

  onBlockBlur() {
    this._isSelected.setValue(false);
  }

  // 把编辑器视图的 state 绑定到 service 层，方便直接操作视图
  bindingRendererStates(states: {
    avatarThumbnail: ServiceStateContext<string>;
    characterName: ServiceStateContext<string>;
    isSelected: ServiceStateContext<boolean>;
  }) {
    this._avatarThumbnail = states.avatarThumbnail;
    this._charaterName = states.characterName;
    this._isSelected = states.isSelected;
  }

  setCharacterData(data: APICharacterData) {
    this._characterData = data;
    this._avatarThumbnail.setValue(data.thumbnailData);
    this._charaterName.setValue(data.name);
  }

  getData(): any {
    return {
      character_id: this._characterData.character_id
    };
  }
}
