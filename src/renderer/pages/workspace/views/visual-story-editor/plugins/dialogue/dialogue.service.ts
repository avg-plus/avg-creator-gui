import { CEBlockService } from "../ce-block-service";

export class APIDialogueBlockService extends CEBlockService {
  private _text: string;

  getText() {
    return this._text;
  }

  setText(value: string) {
    this._text = value;
  }

  getData() {
    return {
      text: this._text
    };
  }
}
