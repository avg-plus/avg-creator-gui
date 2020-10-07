import { ToolConfig } from "@editorjs/editorjs";
import { DialogueTextView } from "./dialogue-text-view";
import _ from "@editorjs/editorjs/types/index";

export class APIDialogueText {
  private view = new DialogueTextView();
  private api: EditorJS.API;
  private element!: HTMLElement;
  private _data: any = {};

  constructor(config: { api: EditorJS.API; config?: ToolConfig }) {
    this.api = config.api;

    this.element = this.drawView();
  }

  static get toolbox() {
    return {
      title: "文本对话",
      icon:
        '<svg t="1601362113798" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3931" width="16" height="16"><path d="M853.333333 85.333333H170.666667C123.52 85.333333 85.76 123.52 85.76 170.666667L85.333333 938.666667l170.666667-170.666667h597.333333c47.146667 0 85.333333-38.186667 85.333334-85.333333V170.666667c0-47.146667-38.186667-85.333333-85.333334-85.333334zM256 384h512v85.333333H256v-85.333333z m341.333333 213.333333H256v-85.333333h341.333333v85.333333z m170.666667-256H256v-85.333333h512v85.333333z" p-id="3932"></path></svg>'
    };
  }

  focus() {
    const c = this.element.getElementsByClassName("text-content");
    const element = c.item(0) as HTMLElement;
    this.api.caret.focus(true);
    // element.focus();
  }

  render() {
    return this.view.render(this.api);
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   * @param {ParagraphData} data
   * @public
   */
  merge(data: any) {
    let newData = {
      text: this._data.text + data.text
    };

    this._data = newData;
  }

  /**
   * Get current Tools`s data
   * @returns {ParagraphData} Current data
   * @private
   */
  get data() {
    let text = this.element.innerHTML;
    this._data.text = text;

    return this._data;
  }

  private drawView() {
    const element = this.view.render(this.api);

    return element;
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e: KeyboardEvent) {
    if (e.code !== "Backspace" && e.code !== "Delete") {
      return;
    }

    const { textContent } = this.element;
    if (textContent === "") {
      this.element.innerHTML = "";
    }

    const currentIndex = this.api.blocks.getCurrentBlockIndex();
    const block = this.api.blocks.getBlockByIndex(currentIndex);
    block.call("focus");
  }

  save(toolsContent: HTMLElement) {
    return {
      text: toolsContent.innerHTML
    };
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["P"]
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true
      }
    };
  }
}
