import React from "react";
import { nanoid } from "nanoid";
import { createReactEditorJS } from "react-editor-js";
import { AVGProject } from "../../../../modules/context/project";
// import { Paragraph } from "@editorjs/editorjs";

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
const ReactEditorJS2 = createReactEditorJS();
const ReactEditorJS3 = createReactEditorJS();

console.log(ReactEditorJS, ReactEditorJS2);

export class DocumentTabsStore extends NState<{
  tabs: DocumentTab[];
  activeIndex: number;
}> {
  private editorCached = new Map<string, JSX.Element>([]);

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

  addEditorCached(id: string, editor: JSX.Element) {
    this.editorCached.set(id, editor);
  }

  getEditorCached(id: string) {
    console.log("cached list : ", this.editorCached);

    return this.editorCached.get(id);
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
    const editorCached = documentTabsStore.getEditorCached(
      tab.id
    ) as JSX.Element;
    const storyTab = tab as StoryDocumentTab;
    const storyData = (storyTab.data as AVGTreeNodeModel).storyData;

    if (editorCached) {
      return editorCached;
    } else {
      const editor = (
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

      documentTabsStore.addEditorCached(tab.id, editor);

      return editor;
    }
  };

  const renderTabs = () => {
    return tabs.map((v) => {
      return (
        <Tab
          key={nanoid()}
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
