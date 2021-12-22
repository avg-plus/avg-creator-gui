import EditorJS, { API, BlockAPI, OutputData } from "@editorjs/editorjs";
import { EditorBlockDocument } from "./editor-block-document";
import { APICharacterTool } from "./plugins/character/character.tool";
import { APIDialogueTool } from "./plugins/dialogue/dialogue.tool";

export class GUIVisualStoryEditorService {
  private editor: EditorJS;

  init() {}

  createEditorInstance(holder: string) {
    return new EditorJS({
      holder: holder ?? "editorjs",
      autofocus: true,
      defaultBlock: "dialogue",
      tunes: [],
      data: undefined,
      tools: {
        paragraph: {
          toolbox: false,
          inlineToolbar: false
        },
        dialogue: APIDialogueTool,
        character: APICharacterTool
      },
      onReady: () => {},
      onChange: (api: API, block: BlockAPI) => {
        console.log("block.config", block.id);

        const blockService = EditorBlockDocument.get(block.id);
        if (blockService) {
          blockService.emitContentChanged();
        }
      }
    });
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
