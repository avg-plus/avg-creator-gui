import { EditorBlockDocument } from "../../pages/workspace/views/visual-story-editor/editor-block-document";
import { APICharacterData } from "../../../common/models/character";
import {
  StoryFileData,
  StoryItem
} from "../../../common/services/file-reader/story-file-reader";
import { APIDialogueData } from "../../../common/models/dialogue";

export class CodegenContext {
  currentCharacter: APICharacterData;
}

export class Codegen {
  private context: CodegenContext;
  constructor(context: CodegenContext) {
    this.context = context;
  }

  async run(data: StoryFileData) {
    const lines: string[] = [];
    for (let i = 0; i < data.stories.length; i++) {
      const v = data.stories[i];
      const script = await this.onCodegenProcess(v);

      lines.push(script);
    }

    return lines.join("\n");
  }

  private async onCodegenProcess(storyItem: StoryItem): Promise<string> {
    const gens = {
      dialogue: (await import("./codegen/dialogue.codegen")).default,
      character: (await import("./codegen/character.codegen")).default
    };

    const scriptGenerator = gens[storyItem.type];
    if (scriptGenerator) {
      return scriptGenerator(this.context, storyItem.data as any);
    }

    return "";
  }
}
