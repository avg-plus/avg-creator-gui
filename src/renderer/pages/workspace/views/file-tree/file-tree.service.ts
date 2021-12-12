import { nanoid } from "nanoid";

import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import {
  AVGTreeNodeID,
  AVGTreeNodeModel
} from "../../../../../common/models/tree-node-item";
import { Nullable } from "../../../../../common/traits";
import { WorkspaceContext } from "../../../../modules/context/workspace-context";
import AVGProjectManager from "../../../../modules/context/project-manager";

export class FileTreeService {
  private treeItems: AVGTreeNodeModel[] = [];
  private inRenameStatusNode: string = "";

  setRenameStatus(node: AVGTreeNodeModel | null | undefined) {
    if (!node) {
      this.inRenameStatusNode = "";
      return;
    }

    this.inRenameStatusNode = node.id;
  }

  loadFileTree() {
    const project = WorkspaceContext.getCurrentProject();
    this.treeItems = project.getStoryTree();

    if (!this.treeItems.length) {
      const rootNode = this.createNode(
        ResourceTreeNodeTypes.StoryRootFolder,
        null
      );
      rootNode.text = project.getData().project_name;
    }

    return this.treeItems;
  }

  updateTreeData(treeData: AVGTreeNodeModel[]) {
    this.treeItems = treeData;
    this.commitChanges();
  }

  getTreeData() {
    return this.treeItems;
  }

  createNode(type: ResourceTreeNodeTypes, parent: Nullable<AVGTreeNodeModel>) {
    const newNode = {
      id: nanoid(),
      type,
      parent: parent?.id ?? "root",
      text: "",
      data: {}
    };

    this.treeItems.push(newNode);

    return newNode;
  }

  /**
   *
   * @param node 重命名结束
   */
  onRenameEnd(node: Nullable<AVGTreeNodeModel>) {
    this.commitChanges();
  }

  /**
   * 提交变更并写入到项目文件
   */
  private commitChanges() {
    const project = WorkspaceContext.getCurrentProject();
    project.setStoryTree(this.treeItems);

    if (project) {
      AVGProjectManager.saveProject(project);
    }
  }
}
