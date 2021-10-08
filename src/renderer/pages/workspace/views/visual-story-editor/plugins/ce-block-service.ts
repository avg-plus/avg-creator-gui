import { BlockToolConstructorOptions } from "@editorjs/editorjs";
import { CETool } from "./ce-plugin";

export type ServiceStateContext<T> = {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
};

export abstract class CEBlockService<TData extends object = object> {
  private _toolView: CETool;
  options: BlockToolConstructorOptions<TData>;

  constructor(options: BlockToolConstructorOptions<TData>) {
    this.options = options;
  }

  getData() {
    return this.options.data;
  }

  setData(data: TData) {
    this.options.data = data;
  }

  getBlockID() {
    return this.options.block!.id!;
  }

  registerToolView(toolView: CETool) {
    this._toolView = toolView;
  }

  getToolView() {
    return this._toolView;
  }

  abstract onBlockInit(): void;
  abstract onBlockClicked(): void;
}
