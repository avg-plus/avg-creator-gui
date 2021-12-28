import $, { map } from "jquery";
import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { AVGProject } from "../../../../modules/context/project";
import { EditorService } from "../visual-story-editor/editor-service";
import { documentTabsStore } from "./document-tabs.view";

export type DocumentTabType = "story" | "blank";

export interface DocumentTab {
  id: string;
  title: string;
  closable: boolean;
  type: DocumentTabType;
}

export interface StoryDocumentTab extends DocumentTab {
  unsaveStatus: boolean;
  editorService: EditorService;
  data: AVGTreeNodeModel | {};
}

export class DocumentTabsService {
  private project: AVGProject;
  private tabs: DocumentTab[] = [];
  private activeTabIndex = 0;

  constructor(project: AVGProject) {
    this.project = project;

    // Add default tab
    if (!this.tabs.length) {
      this.openTab("blank", {});
    }
  }

  getTabs() {
    return this.tabs;
  }

  setActiveTab(index: number) {
    const tab = this.tabs[index];
    if (tab && tab.type !== "blank") {
      this.activeTabIndex = index;
      return;
    }
  }

  getActiveTab() {
    return this.tabs[this.activeTabIndex];
  }

  openTab(type: DocumentTabType, node: AVGTreeNodeModel | {}) {
    const tab = {
      id: "",
      title: "",
      type,
      closable: true,
      unsaveStatus: false,
      data: node
    } as DocumentTab;

    if (type === "story" && node) {
      tab.id = (node as AVGTreeNodeModel).id;
      tab.title = (node as AVGTreeNodeModel).text;
      (tab as StoryDocumentTab).unsaveStatus = (
        node as AVGTreeNodeModel
      ).shouldSave;
    } else if (type === "blank") {
      tab.id = "blank";
      tab.title = "开始使用";
    }

    let tabData = this.getTabDataByID(tab.id);
    if (tabData.index === -1 && !tabData.tab) {
      this.tabs.push(tab);
      tabData.index = this.tabs.indexOf(tab);
      documentTabsStore.setTabList(this.tabs);

      if (type === "story" && !(tab as StoryDocumentTab).editorService) {
        (tab as StoryDocumentTab).editorService = new EditorService(
          `editor-placeholder-${tab.id}`
        );

        (node as AVGTreeNodeModel).documentTab = tab;
      }
    } else if (type === "story" && tabData.index >= 0 && tabData.tab) {
      (node as AVGTreeNodeModel).documentTab = tabData.tab;
    }

    // active tab
    documentTabsStore.setActiveIndex(tabData.index);

    if (type === "story") {
      // setTimeout(() => {
      //   this.attachEditorToTab(tab);
      // }, 1000);
    }
  }

  closeTab(index: number) {
    this.tabs.splice(index, 1);

    if (this.tabs.length > 0) {
      documentTabsStore.setActiveIndex(this.tabs.length - 1);
    } else {
      documentTabsStore.setActiveIndex(0);
    }

    documentTabsStore.setTabList(this.tabs);
  }

  attachEditorToTab(tab: DocumentTab) {
    // 把编辑器移动到标签页内
    // (tab as StoryDocumentTab).editorService.activeEditorHolderElement(true);
    // const element = $(`#editor-${tab.id}`).detach();
    // $(`#editor-placeholder-${tab.id}`).append(element);
  }

  dettachEditorToTab(tab: DocumentTab) {
    // // 把编辑器移动到标签页内
    // const element = $(`#editor-${tab.id}`).detach();
    // $("#editor-instances-container").append(element);
    // (tab as StoryDocumentTab).editorService.activeEditorHolderElement(false);
  }

  private getTabDataByID(id: string) {
    let foundIndex = -1;
    const tab = this.tabs.find((v, index) => {
      if (v.id === id) {
        foundIndex = index;
        return true;
      }

      return false;
    });

    return {
      tab,
      index: foundIndex
    };
  }
}
