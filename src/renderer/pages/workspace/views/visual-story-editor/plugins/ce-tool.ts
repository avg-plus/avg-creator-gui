import { BlockAPI, BlockToolConstructorOptions } from "@editorjs/editorjs";
import ReactDOM from "react-dom";
import { WorkspaceContext } from "../../../../../modules/context/workspace-context";
import { StoryDocumentTab } from "../../document-tabs/document-tabs.service";
import { CEBlockService } from "./ce-block-service";

export abstract class CETool<
  TData extends object = object,
  TService extends CEBlockService<TData> = CEBlockService<TData>
> {
  public options: BlockToolConstructorOptions<TData>;
  public service: TService;
  protected rootElement: HTMLDivElement;
  private eventMaps = {};

  constructor(options: BlockToolConstructorOptions<TData>, service: TService) {
    this.options = options;
    this.service = service;
    this.options.config = this;

    service.setData(this.options.data);
    this.service.registerToolView(this);

    this.eventMaps = {
      onkeydown: this.onKeyDown.bind(this),
      onkeyup: this.onKeyUp.bind(this)
    };
  }

  protected renderView(element: JSX.Element, target: CETool) {
    this.rootElement = document.createElement("div");
    ReactDOM.render(
      element,
      this.rootElement,
      () => {}
    ) as unknown as HTMLElement;

    // 注册键盘消息
    Object.keys(this.eventMaps).forEach((v) => {
      this.rootElement[v] = this.eventMaps[v].bind(target);
    });

    return this.rootElement;
  }

  // 实现 editor 的 lifecycle 渲染方法
  rendered() {
    // 注册到 block 管理器
    if (this.options.block?.id) {
      // 这里因为第三方库的问题导致只能通过全局对象来获取 project
      const project = WorkspaceContext.getCurrentProject();
      const tabService = project.getDocumentTabsService();
      const documentTab = tabService.getActiveTab();
      const editorService = (documentTab as StoryDocumentTab).editorService;

      editorService.registerBlock(this.options.block.id, this.service);
    }
  }

  removed(): void {
    if (this.options.block?.id) {
      // 这里因为第三方库的问题导致只能通过全局对象来获取 project
      const project = WorkspaceContext.getCurrentProject();
      const tabService = project.getDocumentTabsService();
      const documentTab = tabService.getActiveTab();
      const editorService = (documentTab as StoryDocumentTab).editorService;

      editorService.unregisterBlock(this.options.block.id);
    }
  }

  abstract onKeyDown(e: KeyboardEvent): void;
  abstract onKeyUp(e: KeyboardEvent): void;

  abstract render(): HTMLDivElement;
}
