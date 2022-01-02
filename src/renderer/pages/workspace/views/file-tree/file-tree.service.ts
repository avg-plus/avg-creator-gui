import { nanoid } from "nanoid";

import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { Nullable } from "../../../../../common/traits";
import AVGProjectManager from "../../../../modules/context/project-manager";
import { OutputData } from "@editorjs/editorjs";
import { AVGProject } from "../../../../modules/context/project";

export class FileTreeService {
  // private treeItems: AVGTreeNodeModel[] = [];
  private inRenameStatusNode: string = "";
  private project: AVGProject;
  private selectedNode: AVGTreeNodeModel;

  constructor(project: AVGProject) {
    this.project = project;
  }

  setRenameStatus(node: AVGTreeNodeModel | null | undefined) {
    if (!node) {
      this.inRenameStatusNode = "";
      return;
    }

    this.inRenameStatusNode = node.id;
  }

  loadFileTree() {
    const documentManager = this.project.getDocumentManager();
    const treeNodes = documentManager.getTreeNodes();

    if (!treeNodes.length) {
      const rootNode = this.createNode(ResourceTreeNodeTypes.ProjectRoot, null);

      rootNode.text = this.project.getData().project_name;
    }

    return treeNodes;
  }

  updateTreeData(treeData: AVGTreeNodeModel[]) {
    const documentManager = this.project.getDocumentManager();

    treeData.forEach((v) => {
      documentManager.updateDocument(v);
    });

    this.commitChanges();
  }

  getTreeData() {
    const documentManager = this.project.getDocumentManager();
    const treeNodes = documentManager.getTreeNodes();

    return treeNodes;
  }

  createNode(
    type: ResourceTreeNodeTypes,
    parent: Nullable<AVGTreeNodeModel>,
    isShadow = false
  ) {
    const parentID =
      parent?.type === ResourceTreeNodeTypes.Folder ||
      parent?.type === ResourceTreeNodeTypes.ProjectRoot
        ? parent.id
        : parent?.parent;

    const newNode = {
      __shadow__: isShadow,
      id: nanoid(),
      type,
      parent: parentID ?? "root",
      text: "",
      data: {}
    } as AVGTreeNodeModel;

    const documentManager = this.project.getDocumentManager();
    documentManager.createDocument(newNode);

    return newNode;
  }

  deleteNode(node: AVGTreeNodeModel) {
    const documentManager = this.project.getDocumentManager();
    const deleted = documentManager.deleteDocument(node);

    // 关闭对应的标签页
    if (deleted) {
      const tabService = this.project.getDocumentTabsService();
      tabService.closeTab(node.id);
    }

    return documentManager.getTreeNodes();
  }

  /**
   *
   * @param node 重命名结束
   */
  onRenameEnd(node: AVGTreeNodeModel, hasUpdated: boolean) {
    const documentManager = this.project.getDocumentManager();

    if (!node) {
      return documentManager.getTreeNodes();
    }

    // 节点是否 shadow
    if (node.__shadow__ === true) {
      if (!hasUpdated) {
        console.log("Node is shadow and no name input, delete.", node);
        return this.deleteNode(node);
      }
    }

    if (hasUpdated) {
      delete node?.__shadow__;
    }

    this.commitChanges();

    return documentManager.getTreeNodes();
  }

  getOpenedNode() {
    return this.selectedNode;
  }

  openStoryDocument(node: AVGTreeNodeModel) {
    this.selectedNode = node;

    if (node.type !== ResourceTreeNodeTypes.StoryNode) {
      return;
    }

    if (!node.storyData) {
      const filename = AVGProjectManager.getStoryFilePath(
        this.project,
        node.id
      );
      const data = this.project.openStory(filename);

      if (!data.stories.length) {
        data.stories = [];
      }

      node.storyData = {
        version: data.meta.version,
        time: data.meta.time,
        blocks: data.stories
      } as unknown as OutputData;
    }

    // GUIVisualStoryEditorService.renderStoryData(node.storyData);

    const tabsService = this.project.getDocumentTabsService();
    tabsService.openTab("story", node);
  }

  /**
   * 提交变更并写入到项目文件
   */
  private commitChanges() {
    const documentManager = this.project.getDocumentManager();
    documentManager.commitChanges();
  }
}
