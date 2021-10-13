import Cropper from "cropperjs";
import { APICharacterData } from "../../../../../../../common/models/character";
import { CodegenContext } from "../../../../../../modules/compilers/codegen-context";
import { EditorBlockDocument } from "../../editor-block-document";
import { CEBlockService, ServiceStateContext } from "../ce-block-service";
import gen from "./character.codegen";

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

  onBlockClicked() {
    this._isSelected.setValue(true);
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

  isSelected() {
    return (
      EditorBlockDocument.getCurrentFocusBlock()?.getBlockID() ===
      this.getBlockID()
    );
  }

  setCharacterData(data: APICharacterData) {
    this._characterData = data;
    this._avatarThumbnail.setValue(data.thumbnailData);
    this._charaterName.setValue(data.name);
  }

  onCodegenProcess(context: CodegenContext, data: APICharacterData): string {
    return gen(context, data);
  }

  getData(): any {
    return {
      character_id: this._characterData.character_id
    };
  }
}
