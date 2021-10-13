import { BlockToolConstructorOptions } from "@editorjs/editorjs";
import { EditorBlockDocument } from "../editor-block-document";
import { CEBlockService } from "./ce-block-service";

export type EditorPluginEventMap = {
  target?: ThisType<CETool>;
  events?: {
    onKeyDown?: (e: KeyboardEvent) => void;
    onKeyUp?: (e: KeyboardEvent) => void;
  };
};

export abstract class CETool<
  TData extends object = object,
  TService extends CEBlockService<TData> = CEBlockService<TData>
> {
  public options: BlockToolConstructorOptions<TData>;
  public service: TService;

  constructor(options: BlockToolConstructorOptions<TData>, service: TService) {
    this.options = options;
    this.service = service;

    this.options.config = this;

    service.setData(this.options.data);
  }

  // 实现 editor 的 lifecycle 渲染方法
  rendered() {
    // 注册到 block 管理器
    if (this.options.block?.id) {
      EditorBlockDocument.registerBlock(this.options.block.id, this.service);
    }
  }

  removed(): void {
    if (this.options.block?.id) {
      EditorBlockDocument.unregisterBlock(this.options.block.id);
    }
  }

  abstract onKeyDown(e: KeyboardEvent): void;
  abstract onKeyUp(e: KeyboardEvent): void;

  abstract render(): HTMLDivElement;
}
