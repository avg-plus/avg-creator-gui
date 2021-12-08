import React, { useState } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { AVGTreeNodeView } from "./tree-node.view";
import { theme } from "./file-tree.theme";

import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";
import { ResourceTreeNodeTypes } from "../../../../../common/models/resource-tree-node-types";

import "./file-tree.view.less";

export const FileTreeView = () => {
  const [treeData, setTreeData] = useState<AVGTreeNodeModel[]>([
    {
      id: 1,
      parent: 0,
      droppable: true,
      text: "Folder 1",
      data: {
        nodeType: ResourceTreeNodeTypes.Folder
      }
    },
    {
      id: 2,
      parent: 1,
      droppable: false,
      text: "File 1-1",
      data: {}
    },
    {
      id: 3,
      parent: 1,
      droppable: false,
      text: "File 1-2",
      data: {}
    },
    {
      id: 4,
      parent: 0,
      droppable: true,
      text: "Folder 2",
      data: {
        nodeType: ResourceTreeNodeTypes.Folder
      }
    },
    {
      id: 5,
      parent: 4,
      droppable: true,
      text: "Folder 2-1",
      data: {
        nodeType: ResourceTreeNodeTypes.Folder
      }
    },
    {
      id: 6,
      parent: 5,
      droppable: false,
      text: "File 2-1-1",
      data: {}
    },
    {
      id: 7,
      parent: 0,
      droppable: false,
      text: "File 3",
      data: {}
    }
  ]);
  const [selectedNode, setSelectedNode] = useState<AVGTreeNodeModel>();

  const handleSelect = (node: AVGTreeNodeModel) => {
    console.log("selected node: ", node);
    setSelectedNode(node);
  };
  const handleDrop = (newTreeData: React.SetStateAction<AVGTreeNodeModel[]>) =>
    setTreeData(newTreeData);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className={"tree-container"}>
          <Tree
            tree={treeData}
            rootId={0}
            onDrop={handleDrop}
            render={(node, { depth, isOpen, onToggle }) => (
              <AVGTreeNodeView
                node={node}
                depth={depth}
                isOpen={isOpen}
                isSelected={node.id === selectedNode?.id}
                onToggle={onToggle}
                onSelect={handleSelect}
              />
            )}
            // dragPreviewRender={(
            //   monitorProps: DragLayerMonitorProps<AVGTreeNode>
            // ) => <CustomDragPreview monitorProps={monitorProps} />}
            classes={{
              root: "treeRoot",
              draggingSource: "draggingSource",
              dropTarget: "dropTarget"
            }}
          />
        </div>
      </ThemeProvider>
    </StylesProvider>
  );
};
