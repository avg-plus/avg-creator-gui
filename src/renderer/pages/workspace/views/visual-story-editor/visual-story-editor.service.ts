import EditorJS, { BlockAPI, LogLevels, OutputData } from "@editorjs/editorjs";
import { WorkspaceDebugUI } from "../../../../../common/services/workspace-debug-ui";
import { EditorBlockDocument } from "./editor-block-document";
import { APICharacterTool } from "./plugins/character/character.tool";
import { APIDialogueTool } from "./plugins/dialogue/dialogue.tool";

export class GUIVisualStoryEditorService {
  private static editor: EditorJS;

  static load(data?: OutputData) {
    if (this.editor) {
      this.editor.clear();
      this.editor.destroy();
    }

    this.editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      defaultBlock: "dialogue",
      tunes: [],
      data: data ?? undefined,
      tools: {
        // paragraph: APIDialogueTool,
        dialogue: APIDialogueTool,
        character: APICharacterTool
      },
      onReady: () => {}
    });
  }

  static getEditor() {
    return this.editor;
  }
}
