import { nanoid } from "nanoid";

import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
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
    project.loadProject(project.getDir("root"));
    this.treeItems = project.getStoryTree();

    if (!this.treeItems.length) {
      const rootNode = this.createNode(ResourceTreeNodeTypes.ProjectRoot, null);
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
    const parentID =
      parent?.type === ResourceTreeNodeTypes.Folder ||
      parent?.type === ResourceTreeNodeTypes.ProjectRoot
        ? parent.id
        : parent?.parent;

    const newNode = {
      id: nanoid(),
      type,
      parent: parentID ?? "root",
      text: "",
      data: {}
    } as AVGTreeNodeModel;

    // 在对应目录下创建响应的文件实体
    const project = WorkspaceContext.getCurrentProject();
    if (newNode.type === ResourceTreeNodeTypes.StoryNode) {
      AVGProjectManager.createStoryFile(project, newNode.id);
    }

    this.treeItems.push(newNode);

    return newNode;
  }

  deleteNode(node: Nullable<AVGTreeNodeModel>) {
    if (!node) {
      return;
    }

    const project = WorkspaceContext.getCurrentProject();
    this.treeItems = this.treeItems.filter((v) => {
      // 删除节点时，同时删除其子节点
      return v.id !== node.id && v.parent !== node.id;
    });

    // 删除对应的文件
    if (node.type === ResourceTreeNodeTypes.StoryNode) {
      AVGProjectManager.deleteStoryFile(project, node.id);
    }

    this.commitChanges();

    return this.treeItems;
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
