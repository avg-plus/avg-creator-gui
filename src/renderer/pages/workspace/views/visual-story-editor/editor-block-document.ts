import { logger } from "../../../../common/lib/logger";
import { CEBlockService } from "./plugins/ce-block-service";
import { GUIVisualStoryEditorService } from "./visual-story-editor.service";

export class EditorBlockDocument {
  private static blockServices: Map<string, CEBlockService> = new Map<
    string,
    CEBlockService
  >();

  private static focusBlock: CEBlockService | undefined;

  static get(id: string) {
    return this.blockServices.get(id);
  }

  static async getBlockList() {
    const editor = GUIVisualStoryEditorService.getEditor();
    const output = await editor.save();

    const blocks: CEBlockService[] = [];
    for (let i = 0; i < output.blocks.length; i++) {
      const element = output.blocks[i];

      const block = this.get(element.id!);
      if (block) {
        blocks.push(block);
      }
    }

    return blocks;
  }

  static async setFocusBlock(id: string) {
    // 取消所有 block 的焦点
    this.focusBlock = this.blockServices.get(id);
    console.log("this.focusBlock", this.focusBlock);
  }

  static getCurrentFocusBlock() {
    return this.focusBlock;
  }

  static registerBlock(id: string, service: CEBlockService) {
    this.blockServices.set(id, service);
    logger.verbose("Register block", id);
  }

  static unregisterBlock(id: string) {
    this.blockServices.delete(id);
    logger.verbose("UnRegister block", id);
  }

  static clear() {
    this.blockServices.clear();
  }
}
