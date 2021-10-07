import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useMount } from "react-use";
import { BlockToolConstructorOptions } from "@editorjs/editorjs";

import {
  ContentState,
  DraftEditorCommand,
  DraftHandleValue,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  RichUtils
} from "draft-js";

const { isSoftNewlineEvent, hasCommandModifier } = KeyBindingUtil;

import { CETool, EditorPluginEventMap } from "../ce-plugin";
import { APIDialogueBlockService } from "./dialogue.service";

import "./dialogue.tool.less";
import { PluginBaseWrapperComponent } from "../plugin-base-wrapper";

interface DialogueTextEditorProps {
  context: APIDialogueTool;
}

type DialogueToolKeyCommand = DraftEditorCommand | "soft-newline" | null;

export const DialogueTextEditorView = (props: DialogueTextEditorProps) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(ContentState.createFromText(""))
  );

  useMount(() => {
    props.context.service.bindingRendererStates({
      editor: { editorState, setEditorState }
    });
  });

  useEffect(() => {
    // 更新上下文状态
    props.context.service.bindingRendererStates({
      editor: { editorState, setEditorState }
    });
  }, [editorState]);

  const handleReturn = (
    e: React.KeyboardEvent<{}>,
    editorState: EditorState
  ): DraftHandleValue => {
    if (isSoftNewlineEvent(e)) {
      props.context.service.insertSoftNewline();
      return "handled";
    }

    return "handled";
  };

  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState,
    eventTimeStamp: number
  ): DraftHandleValue => {
    const keyCommand = command as DialogueToolKeyCommand;

    return "handled";
  };

  const keyBindingFn = (e: React.KeyboardEvent<{}>): DialogueToolKeyCommand => {
    return getDefaultKeyBinding(e);
  };

  const handleOnChange = (state: EditorState) => {
    setEditorState(state);

    const service = props.context.service;

    service.onTextChanged(state.getCurrentContent().getPlainText());
  };

  return (
    <Editor
      spellCheck={false}
      editorState={editorState}
      onChange={handleOnChange}
      handleReturn={handleReturn}
      // keyBindingFn={keyBindingFn}
      // handleKeyCommand={handleKeyCommand}
    />
  );
};

interface APIDialogueData {
  content: string;
}

export class APIDialogueTool extends CETool<
  APIDialogueData,
  APIDialogueBlockService
> {
  constructor(options: BlockToolConstructorOptions<APIDialogueData>) {
    super(options, new APIDialogueBlockService(options.block!.id));
    this.service.registerToolView(this);

    this._data = {
      content: ""
    };

    options.config = this;
  }

  static get toolbox() {
    return {
      title: "文本对话",
      icon: '<svg t="1633577686901" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2648" width="200" height="200"><path d="M307.2 163.84m81.92 0l552.96 0q81.92 0 81.92 81.92l0 696.32q0 81.92-81.92 81.92l-552.96 0q-81.92 0-81.92-81.92l0-696.32q0-81.92 81.92-81.92Z" fill="#E36130" p-id="2649"></path><path d="M512 399.36a30.72 30.72 0 0 1 30.72-30.72h348.16a30.72 30.72 0 1 1 0 61.44H542.72a30.72 30.72 0 0 1-30.72-30.72z m0 194.56a30.72 30.72 0 0 1 30.72-30.72h348.16a30.72 30.72 0 1 1 0 61.44H542.72a30.72 30.72 0 0 1-30.72-30.72z m30.72 163.84a30.72 30.72 0 1 0 0 61.44h348.16a30.72 30.72 0 1 0 0-61.44H542.72z" fill="#FFA17E" p-id="2650"></path><path d="M51.2 0m81.92 0l573.44 0q81.92 0 81.92 81.92l0 696.32q0 81.92-81.92 81.92l-573.44 0q-81.92 0-81.92-81.92l0-696.32q0-81.92 81.92-81.92Z" fill="#FF7744" p-id="2651"></path><path d="M215.04 266.24a30.72 30.72 0 0 1 30.72-30.72h348.16a30.72 30.72 0 1 1 0 61.44H245.76a30.72 30.72 0 0 1-30.72-30.72z m0 194.56a30.72 30.72 0 0 1 30.72-30.72h348.16a30.72 30.72 0 1 1 0 61.44H245.76a30.72 30.72 0 0 1-30.72-30.72z m30.72 163.84a30.72 30.72 0 1 0 0 61.44h348.16a30.72 30.72 0 1 0 0-61.44H245.76z" fill="#FFA17E" p-id="2652"></path></svg>'
    };
  }

  render() {
    const root = document.createElement("div");
    ReactDOM.render(
      <PluginBaseWrapperComponent blockID={this.service.getBlockID()}>
        <div className={"left-bar"}></div>
        <div className={"underline"}></div>
        <div></div>
        <div className={"dialogue-text"}>
          <DialogueTextEditorView context={this} />
        </div>
      </PluginBaseWrapperComponent>,
      root,
      () => {}
    ) as unknown as HTMLElement;

    root.onkeydown = this.onKeyDown.bind(this);

    return root;
  }

  onKeyDown(e: KeyboardEvent): void {
    console.log("on key down", e.key);
    if (e.key === "Backspace") {
      e.stopPropagation();

      if (this.service.getText().length === 0) {
        if (!this.service.getMarkAsDelete()) {
          this.service.markAsDelete();
        } else {
          const currentIndex = this.options.api.blocks.getCurrentBlockIndex();
          this.options.api.blocks.delete(currentIndex);
        }
      }

      return;
    }

    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      this.service.insertSoftNewline();
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        this.options.api.caret.setToPreviousBlock("default");
        break;
      case "ArrowDown":
        e.preventDefault();
        this.options.api.caret.setToNextBlock("default");
        break;
      // case "Enter":
      //   e.preventDefault();
      //   const currentBlockIndex =
      //     this.options.api.blocks.getCurrentBlockIndex();

      //   // 焦点移到下一行
      //   this.options.api.blocks.insert("dialogue");
      //   this.options.api.caret.setToBlock(currentBlockIndex + 1, "default");
      //   break;
      case "Backspace": {
        e.preventDefault();
        break;
      }
      default:
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {}

  save() {
    return this.service.getData();
  }
}
