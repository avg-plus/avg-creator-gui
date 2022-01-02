import React, { useRef, useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import EditorJS from "@editorjs/editorjs";
import { AVGProject } from "../../../../modules/context/project";

import "./document-tabs.less";
import NState, { setDebug } from "nstate";
import { DocumentTab, StoryDocumentTab } from "./document-tabs.service";
import { GiBookCover } from "react-icons/gi";
import { MdTipsAndUpdates } from "react-icons/md";
import { WorkspaceContext } from "../../../../modules/context/workspace-context";

import Tabs, { Tab } from "../../../../controls/tabs/index.component";
import { RendererApplication } from "../../../../../common/services/renderer-application";
import { APIDialogueTool } from "../visual-story-editor/plugins/dialogue/dialogue.tool";
import { APICharacterTool } from "../visual-story-editor/plugins/character/character.tool";
import { API, BlockAPI } from "@editorjs/editorjs";
import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { useForceUpdate } from "../../../../hooks/use-forceupdate";

setDebug(false); // enable debug log
const ReactEditorJS = createReactEditorJS();
export class DocumentTabsStore extends NState<{
  tabs: DocumentTab[];
  activeIndex: number;
}> {
  setTabList(list: DocumentTab[]) {
    this.setState((draft) => {
      draft.tabs = [...list];
    });
  }

  setDocumentChangedStatus(tab: DocumentTab, isChanged: boolean) {
    tab.unsaveStatus = isChanged;

    this.state.tabs[1].unsaveStatus = true;

    const tabs = [...this.state.tabs];
    this.setTabList(tabs);
  }

  exchangeTabs(a: number, b: number) {
    const tempA = { ...this.state.tabs[a] };
    const tempB = { ...this.state.tabs[b] };
    const tabs = [...this.state.tabs];

    tabs[a] = tempB;
    tabs[b] = tempA;

    this.setTabList(tabs);
    this.setActiveIndex(a);
  }

  setActiveIndex(index: number) {
    this.setState(() => ({ activeIndex: index }));

    const project = WorkspaceContext.getCurrentProject();
    if (project) {
      const tabService = project.getDocumentTabsService();

      if (project && tabService) {
        tabService.setActiveTab(index);
      }
    }
  }

  setEditorRef(tab: StoryDocumentTab, ref: EditorJS) {
    tab.editorService.setEditor(ref);
  }
}

export const documentTabsStore = new DocumentTabsStore({
  tabs: [],
  activeIndex: 0
});

interface DocumentTabsProps {
  project: AVGProject;
}

export const DocumentTabs = (props: DocumentTabsProps) => {
  const tabs = documentTabsStore.useState((s) => s.tabs);
  const activeIndex = documentTabsStore.useState((s) => s.activeIndex);
  const forceUpdate = useForceUpdate();

  const editorCore = React.useRef<EditorJS>();

  const handleInitialize = React.useCallback(
    (tab: StoryDocumentTab, instance: EditorJS) => {
      editorCore.current = instance;
      documentTabsStore.setEditorRef(tab, editorCore.current as EditorJS);
    },
    []
  );

  const renderEditor = (tab: StoryDocumentTab) => {
    const storyTab = tab as StoryDocumentTab;
    const storyData = (storyTab.data as AVGTreeNodeModel).storyData;

    return (
      <ReactEditorJS
        onInitialize={(instance: EditorJS) => {
          handleInitialize(storyTab, instance);
        }}
        key={"editor-" + tab.id}
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

          forceUpdate();
        }}
      />
    );
  };

  const renderTabs = () => {
    return tabs.map((v) => {
      return (
        <Tab
          key={"tab-document-" + v.id}
          showClose={v.closable}
          title={v.unsaveStatus ? `  ${v.title} *` : `  ${v.title}`}
          icon={
            v.type === "blank" ? (
              <MdTipsAndUpdates size={16} />
            ) : (
              <GiBookCover size={16} />
            )
          }
        >
          {v.type === "story" && renderEditor(v as StoryDocumentTab)}
        </Tab>
      );
    });
  };

  const onTabSwitch = (index: number) => {
    documentTabsStore.setActiveIndex(index);
  };

  const onTabPositionChange = (a: number, b: number) => {
    documentTabsStore.exchangeTabs(a, b);
  };

  const onTabClose = (index: number) => {
    const tabService = props.project.getDocumentTabsService();
    tabService.closeTab(index);
  };

  return (
    <>
      <Tabs
        active={activeIndex}
        color={RendererApplication.ThemePrimaryColor}
        onTabPositionChange={onTabPositionChange}
        onTabSwitch={onTabSwitch}
        onTabClose={onTabClose}
        draggable={true}
        showAdd={true}
      >
        {renderTabs()}
      </Tabs>
    </>
  );
};
