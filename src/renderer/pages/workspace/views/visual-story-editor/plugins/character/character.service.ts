import { CEBlockService } from "../ce-block-service";

export class APICharacterBlockService extends CEBlockService {
  _text: string = "";

  // 把编辑器视图的 state 绑定到 service 层，方便直接操作视图
  bindingRendererStates() {}

  setImage(url: string) {}

  getData() {
    return {
      text: this._text
    };
  }
}
