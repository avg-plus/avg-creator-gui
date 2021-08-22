import React, { useState } from "react";
import ReactDOM from "react-dom";
import parser from "bbcode-to-react";
import {
  DraftEditorCommand,
  DraftHandleValue,
  Editor,
  EditorState,
  KeyBindingUtil
} from "draft-js";

import { EditorPluginEventMap } from "../ce-plugin";

import "./vendor.less";
import classnames from "classnames";

type ToolRenderElements = {
  containerElement: HTMLElement | null;
  contentElement: HTMLElement | null;
};

const DialogueTextEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const styleMap = {
    STRIKETHROUGH: {
      textDecoration: "line-through"
    }
  };

  const handleKeyCommand = (
    command: string,
    editorState: EditorState,
    eventTimeStamp: number
  ): DraftHandleValue => {
    return "handled";
  };

  const handleReturn = (
    e: React.KeyboardEvent<{}>,
    editorState: EditorState
  ): DraftHandleValue => {
    console.log("handle returned: ");

    return "handled";
  };

  return (
    <Editor
      spellCheck={false}
      customStyleMap={styleMap}
      editorState={editorState}
      onChange={setEditorState}
      onTab={() => {
        console.log("on tab");
      }}
      handleReturn={handleReturn}
      handleBeforeInput={(
        chars: string,
        editorState: EditorState,
        eventTimeStamp: number
      ) => {
        console.log("handle before input: ", chars);
        return "handled";
      }}
      // handleKeyCommand={handleKeyCommand}
    />
  );
};

export default class {
  static elements: ToolRenderElements = {
    containerElement: null,
    contentElement: null
  };

  static render(text: string, eventData?: EditorPluginEventMap): HTMLElement {
    const container = ReactDOM.render(
      <div
        className={"dialogue-container"}
        ref={(element) => {
          this.elements.containerElement = element;
        }}
      >
        <div className={"left-bar head-dialogue-node"}></div>
        <div
          className={classnames("indicator-point", {
            // 是否为结束节点，UI的结束意味着对话不会有向下连接线，逻辑上的结束节点意味着对话会隐藏
            // "end-dialogue": isEndDialogueNode && item.isAsEndDialogue()
          })}
        ></div>
        {/* <div
          ref={(element) => {
            this.elements.contentElement = element;

            if (eventData) {
              this.elements.contentElement!.onkeyup =
                eventData.events.onKeyUp?.bind(eventData.target);

              this.elements.contentElement!.onkeydown =
                eventData.events.onKeyDown?.bind(eventData.target);
            }
          }}
          className={"dialogue-text"}
          suppressContentEditableWarning={true}
          contentEditable={true}
        >
          {parser.toReact(text)}
        </div> */}
        <div className={"dialogue-text"}>
          <DialogueTextEditor />
        </div>
      </div>,
      document.createElement("div"),
      () => {}
    ) as unknown as HTMLElement;

    return container;
  }

  static getContent() {
    const content = this.elements.contentElement?.innerHTML ?? "";
    console.log("content", content);

    return this.elements.contentElement?.textContent ?? "";
  }

  static setContent(content: string) {
    if (this.elements.contentElement) {
      this.elements.contentElement.innerHTML = content;
    }
  }

  static selectAll() {
    this.elements.contentElement!.focus();
    document.execCommand("selectAll", true);
  }

  static insertTo(text: string, index?: number) {
    // if (index === undefined) {
    //   if (selection) {
    //     const cursorPosition = selection.anchorOffset;
    //     var sel = documentselection.createRange();
    //     sel.text = text;
    //   }
    // }
    // const selection = document.getSelection();
    // document.execCommand("insertText", false, "banana");
  }
}
