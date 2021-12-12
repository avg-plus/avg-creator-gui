import { NodeModel } from "@minoru/react-dnd-treeview";
import { ResourceTreeNodeTypes } from "./resource-tree-node-types";

export type AVGTreeNodeID = string | "root";

export interface AVGTreeNodeModel extends NodeModel {
  id: AVGTreeNodeID;
  type: ResourceTreeNodeTypes;
  data: any;
}
