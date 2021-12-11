import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { Nullable } from "../../../../../common/traits";
import { AVGProjectManager } from "../../../../modules/context/project-manager";
import { WorkspaceContext } from "../../../../modules/context/workspace-context";

export class FileTreeService {
  private static treeItems: AVGTreeNodeModel[] = [];
  private static inRenameStatusNode: string = "";

  static setRenameStatus(node: AVGTreeNodeModel | null | undefined) {
    if (!node) {
      this.inRenameStatusNode = "";
      return;
    }

    this.inRenameStatusNode = node.id;
  }

  static isInRenameStatus() {
    return this.inRenameStatusNode !== "";
  }

  static loadFileTree() {
    const project = WorkspaceContext.getCurrentProject();
    this.treeItems = project.getStoryTree();

    return this.treeItems;
  }

  static updateTreeData(treeData: AVGTreeNodeModel[]) {
    this.treeItems = treeData;
    this.commitChanges();
  }

  static getTreeData() {
    return this.treeItems;
  }

  static onRenameEnd(node: Nullable<AVGTreeNodeModel>) {
    this.commitChanges();
  }

  private static commitChanges() {
    const project = WorkspaceContext.getCurrentProject();
    project.setStoryTree(this.treeItems);

    AVGProjectManager.saveProject(project);
  }
}
