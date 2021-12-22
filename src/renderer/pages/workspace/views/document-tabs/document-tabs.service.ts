import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { AVGProject } from "../../../../modules/context/project";

export type DocumentTabType = "story" | "blank";

export interface DocumentTab {
  title: string;
  closable: boolean;
  type: DocumentTabType;
  data?: AVGTreeNodeModel | {};
}

export class DocumentTabsService {
  private project: AVGProject;
  private tabs: DocumentTab[] = [];

  constructor(project: AVGProject) {
    this.project = project;
  }

  getTabs() {
    return [...this.tabs];
  }

  addTab(type: DocumentTabType, data?: AVGTreeNodeModel) {
    const tab = {
      title: "",
      type,
      closable: true,
      data
    } as DocumentTab;

    if (type === "story") {
      tab.title = (data as AVGTreeNodeModel).text;
    }

    this.tabs.push(tab);

    this.tabs = [...this.tabs];
  }
}
