import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useMount } from "react-use";
import { BlockToolConstructorOptions } from "@editorjs/editorjs";
import { DraftHandleValue, Editor, EditorState, RichUtils } from "draft-js";
import { CETool, EditorPluginEventMap } from "../ce-plugin";

import "./dialogue.tool.less";
import { APIDialogueBlockService } from "./dialogue.service";

type APIDialogueRendererContext = {
  onEnter?: (e: React.KeyboardEvent<{}>) => void;
  onTextChanged?: (text: string) => void;
  insertSoftNewline?: () => void;
  getText?: () => string;
  setText?: (value: string) => void;
};

interface DialogueTextEditorProps {
  // context: APIDialogueRendererContext;
}

export const DialogueTextEditor = (props: DialogueTextEditorProps) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useMount(() => {
    // props.context.insertSoftNewline = () => {
    //   const newEditorState = RichUtils.insertSoftNewline(editorState);
    //   setEditorState(newEditorState);
    // };
    // props.context.getText = () => {
    //   return editorState.getCurrentContent().getPlainText();
    // };
  });

  const handleReturn = (
    e: React.KeyboardEvent<{}>,
    editorState: EditorState
  ): DraftHandleValue => {
    // props.context.onEnter && props.context.onEnter(e);
    return "handled";
  };

  const handleOnChange = (state: EditorState) => {
    setEditorState(state);

    // props.context.onTextChanged &&
    //   props.context.onTextChanged(state.getCurrentContent().getPlainText());
  };

  return (
    <Editor
      spellCheck={false}
      editorState={editorState}
      onChange={handleOnChange}
      handleReturn={handleReturn}
    />
  );
};

// class APIDialogueRenderer {
//   context: APIDialogueRendererContext;

//   render(text: string, eventData: EditorPluginEventMap): HTMLElement {
//     this.context = {
//       onEnter: eventData.events?.onKeyDown?.bind(eventData.target)
//     };

//     const root = document.createElement("div");
//     ReactDOM.render(
//       <div className={"vendor-container"}>
//         <div className={"left-bar"}></div>
//         <div className={"underline"}></div>
//         <div></div>
//         <div className={"dialogue-text"}>
//           <DialogueTextEditor context={this.context} />
//         </div>
//       </div>,
//       root,
//       () => {}
//     ) as unknown as HTMLElement;

//     return root;
//   }

//   insertSoftNewline() {
//     if (this.context.insertSoftNewline) {
//       this.context.insertSoftNewline();
//     }
//   }

//   getContent() {
//     if (this.context.getText) {
//       return this.context.getText();
//     }

//     return null;
//   }

//   setContent(content: string) {
//     // if (this.elements.contentElement) {
//     //   this.elements.contentElement.innerHTML = content;
//     // }
//   }

//   selectAll() {
//     // this.elements.contentElement!.focus();
//     // document.execCommand("selectAll", true);
//   }

//   insertTo(text: string, index?: number) {
//     // if (index === undefined) {
//     //   if (selection) {
//     //     const cursorPosition = selection.anchorOffset;
//     //     var sel = documentselection.createRange();
//     //     sel.text = text;
//     //   }
//     // }
//     // const selection = document.getSelection();
//     // document.execCommand("insertText", false, "banana");
//   }
// }

interface APIDialogueData {
  content: string;
}

export class APIDialogueTool extends CETool<
  APIDialogueData,
  APIDialogueBlockService
> {
  // private renderer = new APIDialogueRenderer();

  constructor(options: BlockToolConstructorOptions<APIDialogueData>) {
    super(options, APIDialogueBlockService);

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
      <div className={"vendor-container"}>
        <div className={"left-bar"}></div>
        <div className={"underline"}></div>
        <div></div>
        <div className={"dialogue-text"}>
          <DialogueTextEditor />
        </div>
      </div>,
      root,
      () => {}
    ) as unknown as HTMLElement;

    return root;
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      // this.renderer.insertSoftNewline();
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
}
