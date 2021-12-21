import { BlockToolConstructorOptions } from "@editorjs/editorjs";
import { ResourceTreeNodeTypes } from "../../../../../../common/models/resource-tree-node-types";
import { WorkspaceContext } from "../../../../../modules/context/workspace-context";
import { GUIVisualStoryEditorService } from "../visual-story-editor.service";
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

  async emitContentChanged() {
    // 获取当前项目
    const project = WorkspaceContext.getCurrentProject();

    // 找到对应的树节点
    const treeService = project.getTreeService();
    const node = treeService.getOpenedNode();

    console.log("emitContentChanged", node);

    if (node && node.type === ResourceTreeNodeTypes.StoryNode) {
      const editor = GUIVisualStoryEditorService.getEditor();
      const output = await editor.save();
      node.shouldSave = true;
      node.storyData = output;

      project.onFileContentChanged(node);
    }
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
