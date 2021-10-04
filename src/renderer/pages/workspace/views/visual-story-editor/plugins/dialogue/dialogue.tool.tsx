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

interface DialogueTextEditorProps {
  context: APIDialogueTool;
}

type DialogueToolKeyCommand = DraftEditorCommand | "soft-newline" | null;

export const DialogueTextEditor = (props: DialogueTextEditorProps) => {
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

    this._data = {
      content: ""
    };

    options.config = this;
  }

  static get toolbox() {
    return {
      title: "文本对话",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  render() {
    const root = document.createElement("div");
    ReactDOM.render(
      <div className={"plugin-container"}>
        <div className={"left-bar"}></div>
        <div className={"underline"}></div>
        <div></div>
        <div className={"dialogue-text"}>
          <DialogueTextEditor context={this} />
        </div>
      </div>,
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
