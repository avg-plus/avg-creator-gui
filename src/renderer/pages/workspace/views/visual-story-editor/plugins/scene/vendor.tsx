import React from "react";
import ReactDOM from "react-dom";
import parser from "bbcode-to-react";

import { EditorPluginEventMap } from "../ce-plugin";

import "./vendor.less";
import { APIPrefix } from "../api-prefix";

export default class {
  static element: HTMLElement;
  static render(text: string, eventData?: EditorPluginEventMap): HTMLElement {
    this.element = ReactDOM.render(
      <div className={"dialogue-container"}>
        <APIPrefix type="API"></APIPrefix>
      </div>,
      document.createElement("div")
    ) as unknown as HTMLElement;

    if (eventData) {
      this.element.onkeyup = eventData.events.onKeyUp?.bind(eventData.target);
      this.element.onkeydown = eventData.events.onKeyDown?.bind(
        eventData.target
      );
    }

    return this.element;
  }

  static selectAll() {
    this.element.focus();
    document.execCommand("selectAll", false);
  }
}
