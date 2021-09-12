import EditorJS from "@editorjs/editorjs";
import { APICharacterTool } from "./plugins/character/character";
import { APIDialogueTool } from "./plugins/dialogue/dialogue";

export class GUIVisualStoryEditorService {
  private static editor: EditorJS;

  static init() {
    this.editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      defaultBlock: "dialogue",
      tools: {
        paragraph: APIDialogueTool,
        dialogue: APIDialogueTool,
        character: APICharacterTool
      }
    });
  }
}
