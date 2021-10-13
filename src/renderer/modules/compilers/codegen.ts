import { EditorBlockDocument } from "../../pages/workspace/views/visual-story-editor/editor-block-document";
import { CodegenContext } from "./codegen-context";

export class Codegen {
  static async run() {
    const context = new CodegenContext();
    const blocks = await EditorBlockDocument.getBlockList();

    const codeLines = blocks.map((v) => {
      return v.onCodegenProcess(context, v.getData()) ?? "";
    });

    console.log(codeLines);
  }
}
