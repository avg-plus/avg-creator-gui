import { TreeItem } from "react-sortable-tree";
import { ResourceTreeNodeTypes } from "./resource-tree-node-types";

export interface AVGTreeNode extends TreeItem {
  data?: {
    nodeType: ResourceTreeNodeTypes;
    path: string;
    MD5: string;
  };
}
