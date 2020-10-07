import * as React from "react";
import { useMount } from "react-use";

import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";

import { APIDialogueText } from "../../../components/plugins/dialogue-text";

import "./storyboard-view.editorjs.less";

export const StoryboardView_EditorJS = () => {
  useMount(() => {
    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "输入文本，开始创作您的剧本 ——",
      autofocus: true,
      initialBlock: "paragraph",
      tools: {
        // paragraph: {
        //   class: APIDialogueText,
        //   config: {}
        // }
      },
      onReady: () => {
        new DragDrop(editor);
        new Undo({ editor });
      },
      onChange: async (api: EditorJS.API) => {
        const currentIndex = api.blocks.getCurrentBlockIndex();
        const block = editor.blocks.getBlockByIndex(currentIndex);
        block.call("focus");
      }
    });
  });

  return <div id="editorjs"></div>;
};
