import React from "react";
import ReactDOM from "react-dom";

import { CETool } from "../ce-plugin";

import "./dialogue.tool.less";
import { APIExampleBlockService as APIExampleBlockService } from "./example.service";
import { BlockToolConstructorOptions } from "@editorjs/editorjs";

interface APIExampleData {}

export class APIExampleTool extends CETool<
  APIExampleData,
  APIExampleBlockService
> {
  constructor(options: BlockToolConstructorOptions<APIExampleData>) {
    super(options, new APIExampleBlockService(options.block!.id));

    this._data = {
      content: ""
    };

    options.config = this;
  }

  static get toolbox() {
    return {
      title: "范例",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  render() {
    const root = document.createElement("div");
    ReactDOM.render(
      <div className={"vendor-container"}></div>,
      root,
      () => {}
    ) as unknown as HTMLElement;

    root.onkeydown = this.onKeyDown.bind(this);

    return root;
  }

  onKeyDown(e: KeyboardEvent): void {}

  onKeyUp(e: KeyboardEvent) {}

  save() {
    return this.service.getData();
  }
}
