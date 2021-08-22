import { BlockToolConstructorOptions } from "@editorjs/editorjs";
import { key } from "nconf";
import { CEPlugin } from "../ce-plugin";
import EL from "./vendor";

interface APIDialogueData {
  content: string;
}

export class APIDialogueTool extends CEPlugin<APIDialogueData> {
  constructor(options: BlockToolConstructorOptions<APIDialogueData>) {
    super(options);

    this._data = {
      content: ""
    };
  }

  static get toolbox() {
    return {
      title: "文本对话",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  render() {
    return EL.render("", {
      target: this,
      events: {
        onKeyUp: this.onKeyUp,
        onKeyDown: this.onKeyDown
      }
    });
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.metaKey && e.key === "a") {
      e.preventDefault();

      EL.selectAll();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.options.api.caret.setToPreviousBlock("default");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      this.options.api.caret.setToNextBlock("default");
    }

    // 增加软换行
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "<div><br></br></div>");
    } else if (e.key === "Enter") {
      // 对文本插件手动处理回车事件
      e.preventDefault();
      const currentBlockIndex = this.options.api.blocks.getCurrentBlockIndex();

      // 焦点移到下一行
      this.options.api.blocks.insert("dialogue");
      this.options.api.caret.setToBlock(currentBlockIndex + 1, "default");
    }
  }

  onKeyUp(e: KeyboardEvent) {}

  get data() {
    this._data.content = EL.getContent() ?? "";
    return this._data;
  }

  set data(data) {
    this._data = data || {};
    EL.setContent(this._data.content || "");
  }

  static get enableLineBreaks() {
    return true;
  }

  save(blockContent) {
    return {
      url: blockContent.value
    };
  }
}
