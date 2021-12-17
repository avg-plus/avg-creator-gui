import { NodeModel } from "@minoru/react-dnd-treeview";
import { ResourceTreeNodeTypes } from "./resource-tree-node-types";

export type AVGTreeNodeID = string | "root";

export interface AVGTreeNodeModel extends NodeModel {
  id: AVGTreeNodeID;
  type: ResourceTreeNodeTypes;
  is_open: boolean;

  // 标记该节点是否待创建节点
  __shadow__?: boolean;
  data: any;
}
