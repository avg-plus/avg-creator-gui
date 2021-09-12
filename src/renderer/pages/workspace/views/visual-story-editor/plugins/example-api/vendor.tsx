import React from "react";
import ReactDOM from "react-dom";

import { EditorPluginEventMap } from "../ce-plugin";

import "./vendor.less";

export default class {
  static render(text: string, eventData?: EditorPluginEventMap): HTMLElement {
    const root = document.createElement("div");
    const container = ReactDOM.render(
      <div className={"vendor-container"}></div>,
      root,
      () => {}
    ) as unknown as HTMLElement;

    return root;
  }
}
