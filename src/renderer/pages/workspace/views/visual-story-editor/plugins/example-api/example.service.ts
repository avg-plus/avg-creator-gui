import { CEBlockService } from "../ce-block-service";

export class APIExampleBlockService extends CEBlockService {
  _text: string = "";

  // 把编辑器视图的 state 绑定到 service 层，方便直接操作视图
  bindingRendererStates() {}

  getData() {
    return {
      text: this._text
    };
  }
}
