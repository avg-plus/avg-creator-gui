import { BlockToolConstructorOptions } from "@editorjs/editorjs";

export type EditorPluginEventMap = {
  target?: ThisType<CEPlugin<any>>;
  events?: {
    onKeyDown?: (e: KeyboardEvent) => void;
    onKeyUp?: (e: KeyboardEvent) => void;
  };
};

export abstract class CEPlugin<T extends object> {
  protected options: BlockToolConstructorOptions<T>;
  protected _data: T;
  constructor(options: BlockToolConstructorOptions<T>) {
    this.options = options;
  }

  abstract onKeyDown(e: KeyboardEvent): void;
  abstract onKeyUp(e: KeyboardEvent): void;
}
