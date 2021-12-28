import React, { useRef } from "react";
import { createReactEditorJS } from "react-editor-js";
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

  const renderEditor = (tab: DocumentTab) => {
    const storyTab = tab as StoryDocumentTab;
    const storyData = (storyTab.data as AVGTreeNodeModel).storyData;

    return (
      <ReactEditorJS
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
          if (blockService) {
            blockService.emitContentChanged();
          }
        }}
      />
    );
  };

  const renderTabs = () => {
    return tabs.map((v) => {
      return (
        <Tab
          key={v.id}
          showClose={v.closable}
          title={`  ${v.title}`}
          icon={
            v.type === "blank" ? (
              <MdTipsAndUpdates size={16} />
            ) : (
              <GiBookCover size={16} />
            )
          }
        >
          {v.type === "story" && renderEditor(v)}
        </Tab>
      );
    });
  };

  const onTabSwitch = (index: number) => {
    documentTabsStore.setActiveIndex(index);
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
        onTabPositionChange={() => {}}
        onTabSwitch={onTabSwitch}
        onTabClose={onTabClose}
        draggable={true}
        showAdd={false}
      >
        {renderTabs()}
      </Tabs>
    </>
  );
};
