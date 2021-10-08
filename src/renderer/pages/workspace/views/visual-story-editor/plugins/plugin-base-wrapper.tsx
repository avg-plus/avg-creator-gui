import React from "react";
import { EditorBlockDocument } from "../editor-block-manager";

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
      onClick={() => {
        EditorBlockDocument.setFocusBlock(props.blockID);
        EditorBlockDocument.get(props.blockID)?.onBlockClicked();
      }}
    >
      {props.children}
    </div>
  );
};
