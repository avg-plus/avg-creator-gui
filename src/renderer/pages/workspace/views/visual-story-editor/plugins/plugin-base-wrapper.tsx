import React from "react";
import { EditorBlockDocument } from "../editor-block-document";
import { CETool } from "./ce-tool";

import "./plugin.less";

interface PluginBaseWrapperComponentProps {
  tool: CETool;
  children: JSX.Element | JSX.Element[];
}

export const PluginBaseWrapperComponent = (
  props: PluginBaseWrapperComponentProps
) => {
  return (
    <div
      className={"plugin-container"}
      onClick={async () => {
        const blockID = props.tool.service.getBlockID();
        const currentFocus = EditorBlockDocument.getCurrentFocusBlock();
        currentFocus?.onBlockBlur && currentFocus?.onBlockBlur();

        await EditorBlockDocument.setFocusBlock(blockID);
        // props.tool.service.setToBlock(blockID);

        // 触发点击和焦点事件
        const block = EditorBlockDocument.get(blockID);
        if (block) {
          block.onBlockClicked && block.onBlockClicked();
          block.onBlockFocus && block.onBlockFocus();
        }
      }}
    >
      {props.children}
    </div>
  );
};
