import $ from "jquery";
import EditorJS, { API, BlockAPI, OutputData } from "@editorjs/editorjs";

import { logger } from "../../../../common/lib/logger";
import { CEBlockService } from "./plugins/ce-block-service";
import { APICharacterTool } from "./plugins/character/character.tool";
import { APIDialogueTool } from "./plugins/dialogue/dialogue.tool";

export class EditorService {
  private blockServices: Map<string, CEBlockService> = new Map<
    string,
    CEBlockService
  >();

  private focusBlock: CEBlockService | undefined;
  private editor: EditorJS;

  constructor() {}

  getBlock(id: string) {
    return this.blockServices.get(id);
  }

  setEditor(editor: EditorJS) {
    this.editor = editor;
  }

  async getBlockList() {
    const output = await this.editor.save();

    const blocks: CEBlockService[] = [];
    for (let i = 0; i < output.blocks.length; i++) {
      const element = output.blocks[i];

      const block = this.getBlock(element.id!);
      if (block) {
        blocks.push(block);
      }
    }

    return blocks;
  }

  async setFocusBlock(id: string) {
    // 取消所有 block 的焦点
    this.focusBlock = this.blockServices.get(id);
  }

  getCurrentFocusBlock() {
    return this.focusBlock;
  }

  registerBlock(id: string, service: CEBlockService) {
    this.blockServices.set(id, service);
    logger.verbose("Register block", id);
  }

  unregisterBlock(id: string) {
    this.blockServices.delete(id);
    logger.verbose("UnRegister block", id);
  }

  clear() {
    this.blockServices.clear();
  }

  getEditor() {
    return this.editor;
  }

  renderStoryData(stories: OutputData) {
    const editor = this.getEditor();

    editor.render(stories);

    // 如果编辑器是空的，则插入默认块（文本）
    if (!stories || !stories.blocks.length) {
      this.editor.blocks.insert();
      this.editor.focus();
    }
  }
}
