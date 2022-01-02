import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { AVGProject } from "../../../../modules/context/project";
import { EditorService } from "../visual-story-editor/editor-service";
import { documentTabsStore } from "./document-tabs.view";

export type DocumentTabType = "story" | "blank";

export interface DocumentTab {
  id: string;
  title: string;
  closable: boolean;
  unsaveStatus: boolean;
  type: DocumentTabType;
}

export interface StoryDocumentTab extends DocumentTab {
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

    const documentManager = this.project.getDocumentManager();

    if (type === "story" && node) {
      tab.id = (node as AVGTreeNodeModel).id;
      tab.title = (node as AVGTreeNodeModel).text;
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
        (tab as StoryDocumentTab).editorService = new EditorService();
        // `editor-placeholder-${tab.id}`

        documentManager.openDocument(tab);
      }
    } else if (type === "story" && tabData.index >= 0 && tabData.tab) {
      documentManager.openDocument(tabData.tab);
    }

    documentTabsStore.setActiveIndex(tabData.index);
  }

  closeTab(indexOrTab: number | string | DocumentTab) {
    let index = -1;
    if (typeof indexOrTab === "number") {
      index = indexOrTab;
    } else if (typeof indexOrTab === "string") {
      const tabData = this.getTabDataByID(indexOrTab);
      index = tabData.index;
    } else {
      const tabData = this.getTabDataByID(indexOrTab.id);
      index = tabData.index;
    }

    this.tabs.splice(index, 1);

    if (this.tabs.length > 0) {
      documentTabsStore.setActiveIndex(this.tabs.length - 1);
    } else {
      documentTabsStore.setActiveIndex(0);
    }

    documentTabsStore.setTabList(this.tabs);
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
