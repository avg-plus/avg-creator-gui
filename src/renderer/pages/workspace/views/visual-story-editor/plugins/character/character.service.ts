import Cropper from "cropperjs";

import { CharacterData } from "../../../../../../../common/models/character";
import { EditorBlockDocument } from "../../editor-block-manager";
import { CEBlockService, ServiceStateContext } from "../ce-block-service";

export class APICharacterBlockService extends CEBlockService {
  private _characterData: CharacterData;
  private _avatarThumbnail: ServiceStateContext<string>;
  private _charaterName: ServiceStateContext<string>;

  constructor(id: string) {
    super(id);
  }

  onBlockInit() {
    const debugCharacterCached = localStorage.getItem("debug_cached_avatar");

    if (debugCharacterCached) {
      const parsedDebugCharacterCached = JSON.parse(debugCharacterCached);

      const data = new CharacterData();
      data.id = "test-id-" + Date.now();
      data.thumbnailData = parsedDebugCharacterCached.thumbnailData;
      data.name = parsedDebugCharacterCached.name;

      this.setCharacterData(data);
    }
  }

  // 把编辑器视图的 state 绑定到 service 层，方便直接操作视图
  bindingRendererStates(states: {
    avatarThumbnail: ServiceStateContext<string>;
    characterName: ServiceStateContext<string>;
  }) {
    this._avatarThumbnail = states.avatarThumbnail;
    this._charaterName = states.characterName;
  }

  setCharacterData(data: CharacterData) {
    this._characterData = data;
    this._avatarThumbnail.setValue(data.thumbnailData);
    this._charaterName.setValue(data.name);
  }

  getData() {
    return {
      character_id: this._characterData.id
    };
  }
}
