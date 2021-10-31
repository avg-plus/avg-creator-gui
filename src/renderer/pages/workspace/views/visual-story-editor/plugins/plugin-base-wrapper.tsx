import React from "react";
import { EditorBlockDocument } from "../editor-block-document";

import "./plugin.less";

interface PluginBaseWrapperComponentProps {
  blockID: string;
  children: JSX.Element | JSX.Element[];
}

export const PluginBaseWrapperComponent = (
  props: PluginBaseWrapperComponentProps
) => {
  return (
    <div
      className={"plugin-container"}
      onClick={async () => {
        const currentFocus = EditorBlockDocument.getCurrentFocusBlock();
        currentFocus?.onBlockBlur && currentFocus?.onBlockBlur();

        await EditorBlockDocument.setFocusBlock(props.blockID);

        // 触发点击和焦点事件
        const block = EditorBlockDocument.get(props.blockID);
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
