import { CETool } from "./ce-plugin";

export type ServiceStateContext<T> = {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
};

export abstract class CEBlockService {
  private _blockID: string;
  private _toolView: CETool;

  constructor(id: string) {
    this._blockID = id;
  }

  getBlockID() {
    return this._blockID;
  }

  registerToolView(toolView: CETool) {
    this._toolView = toolView;
  }

  getToolView() {
    return this._toolView;
  }

  abstract onBlockInit(): void;
}
