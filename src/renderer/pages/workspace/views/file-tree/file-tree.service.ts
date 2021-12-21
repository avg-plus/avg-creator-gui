import { nanoid } from "nanoid";

import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";
import {
  AVGTreeNodeModel,
  AVGTreeNodePersistence
} from "../../../../../common/models/tree-node-item";
import { Nullable } from "../../../../../common/traits";
import { WorkspaceContext } from "../../../../modules/context/workspace-context";
import AVGProjectManager from "../../../../modules/context/project-manager";
import { GUIVisualStoryEditorService } from "../visual-story-editor/visual-story-editor.service";
import { OutputData } from "@editorjs/editorjs";
import { AVGProject } from "../../../../modules/context/project";

export class FileTreeService {
  private treeItems: AVGTreeNodeModel[] = [];
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
    this.project.loadProject(this.project.getDir("root"));
    this.treeItems = this.project.getStoryTree() as AVGTreeNodeModel[];

    if (!this.treeItems.length) {
      const rootNode = this.createNode(ResourceTreeNodeTypes.ProjectRoot, null);
      console.log("rootNode", rootNode);

      rootNode.text = this.project.getData().project_name;
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
      shouldSave: false,
      data: {}
    } as AVGTreeNodeModel;

    // 在对应目录下创建响应的文件实体
    if (newNode.type === ResourceTreeNodeTypes.StoryNode) {
      AVGProjectManager.createStoryFile(this.project, newNode.id);
    }

    this.treeItems.push(newNode);

    console.log("create node this.treeItems", this.treeItems);

    return newNode;
  }

  deleteNode(node: Nullable<AVGTreeNodeModel>) {
    if (!node) {
      return this.treeItems;
    }

    this.treeItems = this.treeItems.filter((v) => {
      // 删除节点时，同时删除其子节点
      // if (node.parent === v.id) {
      //   AVGProjectManager.deleteStoryFile(this.project, node.id);
      // }

      return v.id !== node.id && v.parent !== node.id;
    });

    // 删除对应的文件
    if (node.type === ResourceTreeNodeTypes.StoryNode) {
      AVGProjectManager.deleteStoryFile(this.project, node.id);
    }

    this.commitChanges();

    return this.treeItems;
  }

  /**
   *
   * @param node 重命名结束
   */
  onRenameEnd(node: AVGTreeNodeModel, hasUpdated: boolean) {
    if (!node) {
      return this.treeItems;
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

    console.log("handleRenameEnd", this.treeItems);
    this.commitChanges();

    return this.treeItems;
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

    GUIVisualStoryEditorService.renderStoryData(node.storyData);
  }

  /**
   * 提交变更并写入到项目文件
   */
  private commitChanges() {
    this.project.setStoryTree(this.treeItems as AVGTreeNodePersistence[]);

    if (this.project) {
      AVGProjectManager.saveProject(this.project);
    }
  }
}
