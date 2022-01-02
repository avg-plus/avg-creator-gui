import { assert } from "../../../common/exception";
import { ResourceTreeNodeTypes } from "../../../common/models/resource-tree-node-types";
import {
  AVGTreeNodeModel,
  AVGTreeNodePersistence
} from "../../../common/models/tree-node-item";
import { logger } from "../../common/lib/logger";
import { DocumentTab } from "../../pages/workspace/views/document-tabs/document-tabs.service";
import { AVGProject } from "./project";
import AVGProjectManager from "../../modules/context/project-manager";

interface IDocument {
  node: AVGTreeNodeModel;
  tab: DocumentTab | null;

  // 内容是否变更
  hasChanged: boolean;
}

export class DocumentManager {
  private project: AVGProject;
  documents: Map<string, IDocument> = new Map<string, IDocument>();

  constructor(project: AVGProject) {
    this.project = project;

    this.loadDocuments();
  }

  getTreeNodes() {
    return Array.from(this.documents.values()).map((v) => {
      return v.node;
    });
  }

  getDocument(id: string) {
    return this.documents.get(id);
  }

  createDocument(node: AVGTreeNodeModel) {
    const document = this.getDocument(node.id);
    assert(!document, "创建文件失败");

    this.documents.set(node.id, { node, hasChanged: false, tab: null });

    try {
      // 在对应目录下创建响应的文件实体
      if (node.type === ResourceTreeNodeTypes.StoryNode) {
        AVGProjectManager.createStoryFile(this.project, node.id);
      }
    } catch (error) {
      this.documents.delete(node.id);
      throw new Error(error);
    }

    return true;
  }

  updateDocument(node: AVGTreeNodeModel) {
    const originDocument = this.getDocument(node.id);
    if (!originDocument) {
      assert(!document, "文件不存在，更新失败。");
      return false;
    }

    this.documents.set(node.id, {
      node,
      tab: originDocument.tab,
      hasChanged: true
    });

    return true;
  }

  deleteDocument(node: AVGTreeNodeModel) {
    if (!node) {
      return this.getTreeNodes();
    }

    const nodes = this.getTreeNodes().filter((v) => {
      // 删除节点时，同时删除其子节点
      // if (node.parent === v.id) {
      //   AVGProjectManager.deleteStoryFile(this.project, node.id);
      // }

      return v.id === node.id || v.parent === node.id;
    });

    logger.debug("Delete nodes: ", nodes);

    // 删除对应的文件
    nodes.forEach((v) => {
      this.documents.delete(v.id);
      AVGProjectManager.deleteStoryFile(this.project, v.id);
    });

    this.commitChanges();

    return this.getTreeNodes();
  }

  openDocument(tabData: DocumentTab) {
    const document = this.getDocument(tabData.id);
    if (document) {
      document.tab = tabData;
      this.documents.set(document.node.id, document);
    }
  }

  commitChanges() {
    this.project.setStoryTree(this.getTreeNodes() as AVGTreeNodePersistence[]);

    if (this.project) {
      AVGProjectManager.saveProject(this.project);
    }
  }

  private loadDocuments() {
    const fileTree = this.project.getStoryTree() as AVGTreeNodeModel[];

    fileTree.forEach((v) => {
      this.documents.set(v.id, {
        node: v,
        tab: null,
        hasChanged: false
      });
    });

    logger.debug("Load documents: ", this.documents);
  }
}
