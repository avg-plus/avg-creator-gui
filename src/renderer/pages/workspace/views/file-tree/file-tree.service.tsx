import { WorkspaceContext } from "../../../../modules/context/workspace-context";

export class FileTreeService {
  static getTreeItem() {
    const project = WorkspaceContext.getCurrentProject();

    return project.getStoryTrees();
  }
}
