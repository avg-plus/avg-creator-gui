import {
  ContentState,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState
} from "draft-js";
import { APIDialogueData } from "../../../../../../../common/models/dialogue";
import { logger } from "../../../../../../common/lib/logger";
import { CodegenContext } from "../../../../../../modules/compilers/codegen-context";
import { CEBlockService } from "../ce-block-service";
import gen from "../../../../../../modules/compilers/codegen/dialogue.codegen";

type EditorStateContext = {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
};

export class APIDialogueBlockService extends CEBlockService<APIDialogueData> {
  _editorStateContext: EditorStateContext;

  // 处理删除时使用，在 block 的文本已经被删除时，不会马上移除该block, 先标记，在下次处理删除时正式删除
  // 默认文本都为空，所以理应都是待删除状态
  _shouldDelete: boolean = true;

  onBlockInit(): void {}
  onBlockClicked() {}

  // 把编辑器视图的 state 绑定到 service 层，方便直接操作视图
  bindingRendererStates(states: {
    editor: {
      editorState: EditorState;
      setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
    };
  }) {
    this._editorStateContext = states.editor;
  }

  insertSoftNewline() {
    this._editorStateContext.setEditorState(
      RichUtils.insertSoftNewline(this._editorStateContext.editorState)
    );
  }

  onTextChanged(text: string) {
    this.options.data.text = text;
    if (this.options.data.text.length > 0) {
      this._shouldDelete = false;
    }
  }

  getText() {
    return this.options.data.text;
  }

  setText(value: string) {
    this.options.data.text = value;

    // 构造新的编辑器上下文对象
    const content = ContentState.createFromText(this.options.data.text);
    const newState = EditorState.createWithContent(content);

    this._editorStateContext.setEditorState(newState);
  }

  markAsDelete() {
    this._shouldDelete = true;
  }

  getMarkAsDelete() {
    return this._shouldDelete;
  }

  getData() {
    return {
      text: this.options.data.text
    };
  }

  onBlockFocus(): void {}
  onBlockBlur(): void {}

  onCodegenProcess(context: CodegenContext, data: APIDialogueData): string {
    return gen(context, data);
  }
}
