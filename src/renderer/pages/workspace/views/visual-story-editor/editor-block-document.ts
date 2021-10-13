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

  static setFocusBlock(id: string) {
    this.focusBlock = this.blockServices.get(id);

    console.log("this.focusBlock", this.focusBlock);
  }

  static getCurrentFocusBlock() {
    return this.focusBlock;
    // const editor = GUIVisualStoryEditorService.getEditor();
    // if (editor && editor.blocks) {
    //   const index = editor.blocks.getCurrentBlockIndex();
    //   const api = editor.blocks.getBlockByIndex(index) as BlockAPI;

    //   if (api && api.id) {
    //     return EditorBlockDocument.get(api.id);
    //   }
    // }

    // return null;
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
