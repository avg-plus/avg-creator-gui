import { BlockToolConstructorOptions } from "@editorjs/editorjs";
import { CETool } from "./ce-tool";

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

  getType() {
    return this.options;
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

  getBlock() {
    return this.options.block;
  }

  registerToolView(toolView: CETool) {
    this._toolView = toolView;
  }

  getToolView() {
    return this._toolView;
  }

  delete() {
    const currentIndex = this.options.api.blocks.getCurrentBlockIndex();
    this.options.api.blocks.delete(currentIndex);
  }

  async setToBlock(id: string) {
    const currentIndex = this.options.api.blocks.getCurrentBlockIndex();
    this.options.api.caret.setToBlock(currentIndex);
  }

  abstract onBlockInit(): void;
  abstract onBlockClicked(): void;
  abstract onBlockFocus(): void;
  abstract onBlockBlur(): void;
}
