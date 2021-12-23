import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { AVGProject } from "../../../../modules/context/project";
import { documentTabsStore } from "./document-tabs.view";

export type DocumentTabType = "story" | "blank";

export interface DocumentTab {
  id: string;
  title: string;
  closable: boolean;
  unsaveStatus: boolean;
  type: DocumentTabType;
  data: AVGTreeNodeModel | {};
}

export class DocumentTabsService {
  private project: AVGProject;
  private tabs: DocumentTab[] = [];

  constructor(project: AVGProject) {
    this.project = project;

    // Add default tab
    if (!this.tabs.length) {
      this.openTab("blank");
    }
  }

  getTabs() {
    return this.tabs;
  }

  openTab(type: DocumentTabType, data?: AVGTreeNodeModel) {
    const tab = {
      id: "",
      title: "",
      type,
      closable: true,
      unsaveStatus: false,
      data
    } as DocumentTab;

    if (type === "story" && data) {
      tab.id = data.id;
      tab.title = (data as AVGTreeNodeModel).text;
      tab.unsaveStatus = data.shouldSave;
    } else if (type === "blank") {
      tab.id = "blank";
      tab.title = "开始使用";
    }

    let index = this.getTabIndexByID(tab.id);
    if (index === -1) {
      this.tabs.push(tab);
      index = this.tabs.indexOf(tab);
      documentTabsStore.setTabList(this.tabs);
    }

    // active tab
    documentTabsStore.setActiveIndex(index);
  }

  closeTab(id: string) {}

  private getTabIndexByID(id: string) {
    let foundIndex = -1;
    this.tabs.find((v, index) => {
      if (v.id === id) {
        foundIndex = index;
        return true;
      }

      return false;
    });

    return foundIndex;
  }
}
