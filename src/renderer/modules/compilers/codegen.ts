import { EditorBlockDocument } from "../../pages/workspace/views/visual-story-editor/editor-block-document";
import { CodegenContext } from "./codegen-context";

export class Codegen {
  static async run() {
    const context = new CodegenContext();
    const blocks = await EditorBlockDocument.getBlockList();

    const codeLines = blocks.map((v) => {
      console.log("get type = ", v.getType());

      return this.onCodegenProcess(context, v.getData()) ?? "";
    });

    console.log(codeLines);
  }

  private static onCodegenProcess(
    context: CodegenContext,
    data: object
  ): string {
    console.log("code", data);

    return "";
    // return gen(context, data);
  }
}
