import React from "react";
import { WorkspaceContext } from "../../../../../modules/context/workspace-context";
import { StoryDocumentTab } from "../../document-tabs/document-tabs.service";
import { EditorService } from "../editor-service";
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
        // 这里因为第三方库的问题导致只能通过全局对象来获取 project
        const project = WorkspaceContext.getCurrentProject();
        const tabService = project.getDocumentTabsService();
        const documentTab = tabService.getActiveTab();
        const editorService = (documentTab as StoryDocumentTab).editorService;

        const blockID = props.tool.service.getBlockID();
        const currentFocus = editorService.getCurrentFocusBlock();
        currentFocus?.onBlockBlur && currentFocus?.onBlockBlur();

        await editorService.setFocusBlock(blockID);
        // props.tool.service.setToBlock(blockID);

        // 触发点击和焦点事件
        const block = editorService.getBlock(blockID);
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
