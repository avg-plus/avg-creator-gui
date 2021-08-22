import EditorJS from "@editorjs/editorjs";
import { APIDialogueTool } from "./plugins/dialogue/dialogue";
import { APISceneTool } from "./plugins/scene/scene";

export class GUIVisualStoryEditorService {
  private static editor: EditorJS;

  static init() {
    this.editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      defaultBlock: "dialogue",
      tools: {
        dialogue: APIDialogueTool,
        scene: APISceneTool
      }
    });
  }
}
