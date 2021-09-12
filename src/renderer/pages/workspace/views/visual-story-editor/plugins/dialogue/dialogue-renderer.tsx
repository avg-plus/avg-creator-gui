import React, { useState } from "react";
import ReactDOM from "react-dom";
import parser from "bbcode-to-react";
import {
  DraftEditorCommand,
  DraftHandleValue,
  Editor,
  EditorState,
  KeyBindingUtil,
  RichUtils
} from "draft-js";

import { EditorPluginEventMap } from "../ce-plugin";

import "./dialogue-renderer.less";
import classnames from "classnames";
import { useMount } from "react-use";

type APIDialogueRendererDelegate = {
  onEnter?: (e: React.KeyboardEvent<{}>) => void;
  insertSoftNewline?: () => void;
};

interface DialogueTextEditorProps {
  delegate: APIDialogueRendererDelegate;
}

export const DialogueTextEditor = (props: DialogueTextEditorProps) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useMount(() => {
    props.delegate.insertSoftNewline = () => {
      const newEditorState = RichUtils.insertSoftNewline(editorState);
      setEditorState(newEditorState);

      // if (newEditorState !== editorState) {
      //   handleOnChange(newEditorState);
      // }
    };
  });

  const styleMap = {
    // STRIKETHROUGH: {
    //   textDecoration: "line-through"
    // }
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
    props.delegate.onEnter && props.delegate.onEnter(e);
    return "handled";
  };

  const handleOnChange = (state: EditorState) => {
    setEditorState(state);
  };

  return (
    <Editor
      spellCheck={false}
      customStyleMap={styleMap}
      editorState={editorState}
      onChange={handleOnChange}
      onTab={() => {
        console.log("on tab");
      }}
      handleReturn={handleReturn}
    />
  );
};

export class APIDialogueRenderer {
  delegate: APIDialogueRendererDelegate = {};

  render(text: string, eventData: EditorPluginEventMap): HTMLElement {
    this.delegate = {
      onEnter: eventData.events?.onKeyDown?.bind(eventData.target)
    };

    const root = document.createElement("div");
    ReactDOM.render(
      <div className={"vendor-container"}>
        <div className={"left-bar"}></div>
        <div className={"underline"}></div>
        <div></div>
        <div className={"dialogue-text"}>
          <DialogueTextEditor delegate={this.delegate} />
        </div>
      </div>,
      root,
      () => {}
    ) as unknown as HTMLElement;

    return root;
  }

  insertSoftNewline() {
    if (this.delegate.insertSoftNewline) {
      this.delegate.insertSoftNewline();
    }
  }

  getContent() {
    // const content = this.elements.contentElement?.innerHTML ?? "";
    // console.log("content", content);
    // return this.elements.contentElement?.textContent ?? "";
  }

  setContent(content: string) {
    // if (this.elements.contentElement) {
    //   this.elements.contentElement.innerHTML = content;
    // }
  }

  selectAll() {
    // this.elements.contentElement!.focus();
    // document.execCommand("selectAll", true);
  }

  insertTo(text: string, index?: number) {
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
