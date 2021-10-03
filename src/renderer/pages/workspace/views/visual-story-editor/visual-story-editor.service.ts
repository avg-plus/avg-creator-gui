import EditorJS, { BlockAPI, LogLevels } from "@editorjs/editorjs";
import { WorkspaceDebugUI } from "../../../../../common/services/workspace-debug-ui";
import { EditorBlockManager } from "./editor-block-manager";
import { APICharacterTool } from "./plugins/character/character";
import { APIDialogueTool } from "./plugins/dialogue/dialogue.tool";

export class GUIVisualStoryEditorService {
  private static editor: EditorJS;

  static init() {
    this.editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      defaultBlock: "dialogue",
      tunes: [],
      tools: {
        // paragraph: APIDialogueTool,
        dialogue: APIDialogueTool,
        character: APICharacterTool
      }
    });

    WorkspaceDebugUI.registerButton("获取块 - 0", () => {
      const api = this.editor.blocks.getBlockByIndex(0) as BlockAPI;
      const block = EditorBlockManager.get(api.id);
      // const tool = block.config as APIDialogueTool;
      console.log("data: ", block);
    });
  }
}
