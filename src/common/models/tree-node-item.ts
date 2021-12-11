import { NodeModel } from "@minoru/react-dnd-treeview";
import { ResourceTreeNodeTypes } from "./resource-tree-node-types";

export interface AVGTreeNodeModel extends NodeModel {
  type: ResourceTreeNodeTypes;
  data: any;
}
