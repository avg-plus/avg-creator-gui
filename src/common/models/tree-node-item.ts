import { OutputData } from "@editorjs/editorjs";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { ResourceTreeNodeTypes } from "./resource-tree-node-types";

export type AVGTreeNodeID = string | "root";

export interface AVGTreeNodePersistence extends NodeModel {
  id: AVGTreeNodeID;
  type: ResourceTreeNodeTypes;
  is_open: boolean;
  focus_index: number;

  data: any;
}

export interface AVGTreeNodeModel extends AVGTreeNodePersistence {
  // 标记该节点是否待创建节点
  __shadow__?: boolean;

  storyData?: OutputData;
  shouldSave: boolean;
}
