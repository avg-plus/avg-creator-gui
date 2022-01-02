import React, { useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { createReactEditorJS } from "react-editor-js";

import { GiBookCover } from "react-icons/gi";
import { MdTipsAndUpdates } from "react-icons/md";
import { Tab } from "../../../../controls/tabs/index.component";
import { DocumentTab, StoryDocumentTab } from "./document-tabs.service";
import { APIDialogueTool } from "../visual-story-editor/plugins/dialogue/dialogue.tool";
import { APICharacterTool } from "../visual-story-editor/plugins/character/character.tool";
import { API, BlockAPI } from "@editorjs/editorjs";
import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { documentTabsStore } from "./document-tabs.view";

import "./document-tab.less";

const ReactEditorJS = createReactEditorJS();

interface IDocumentTabViewProps extends StoryDocumentTab {}

export const DocumentTabView = (props: IDocumentTabViewProps) => {
  const editorCore = React.useRef<EditorJS>();

  const handleInitialize = React.useCallback(
    (tab: StoryDocumentTab, instance: EditorJS) => {
      editorCore.current = instance;
      documentTabsStore.setEditorRef(tab, editorCore.current as EditorJS);
    },
    []
  );

  const renderEditor = () => {
    const storyTab = props;
    const storyData = (storyTab.data as AVGTreeNodeModel).storyData;

    return (
      <ReactEditorJS
        onInitialize={(instance: EditorJS) => {
          handleInitialize(storyTab, instance);
        }}
        key={"editor-" + storyTab.id}
        defaultValue={storyData}
        autofocus={true}
        defaultBlock={"dialogue"}
        tunes={[]}
        data={storyData}
        tools={{
          paragraph: {
            toolbox: false,
            inlineToolbar: false
          },
          dialogue: APIDialogueTool,
          character: APICharacterTool
        }}
        onChange={(api: API, block: BlockAPI) => {
          const blockService = storyTab.editorService.getBlock(block.id);
          console.log("block changed: ", blockService);

          if (blockService) {
            blockService.emitContentChanged();
          }
        }}
      />
    );
  };

  return (
    <Tab
      key={"document-tab-" + props.id}
      showClose={true}
      title={"123"}
      icon={
        props.type === "blank" ? (
          <MdTipsAndUpdates size={16} />
        ) : (
          <GiBookCover size={16} />
        )
      }
    >
      {props.type === "story" && renderEditor()}
    </Tab>
  );
};
