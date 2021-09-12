import React from "react";
import ReactDOM from "react-dom";

import { EditorPluginEventMap } from "../ce-plugin";

import "./vendor.less";

export default class {
  static render(text: string, eventData?: EditorPluginEventMap): HTMLElement {
    const root = document.createElement("div");

    const image = require("../../../../../../images/fake-data/sr.png");
    const container = ReactDOM.render(
      <div className={"vendor-container"}>
        <div className="name-card">
          <div className="avatar-thumbnail">
            <img src={image}></img>
          </div>
          <div className="name">蒋志林</div>
        </div>
      </div>,
      root,
      () => {}
    ) as unknown as HTMLElement;

    return root;
  }
}
