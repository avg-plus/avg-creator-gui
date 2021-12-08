import { NodeModel } from "@minoru/react-dnd-treeview";
import { ResourceTreeNodeTypes } from "./resource-tree-node-types";

export interface AVGTreeNodeModel extends NodeModel {
  data?: {
    nodeType?: ResourceTreeNodeTypes;
    path?: string;
    MD5?: string;
  };
}
