import React, { useState } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { AVGTreeNodeView } from "./tree-node.view";
import { theme } from "./file-tree.theme";

import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";

import "./file-tree.view.less";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { FileTreeService } from "./file-tree.service";

export const FileTreeView = () => {
  const [treeData, setTreeData] = useState<AVGTreeNodeModel[]>(
    FileTreeService.getTreeItem()
  );
  const [selectedNode, setSelectedNode] = useState<AVGTreeNodeModel | null>();

  const handleSelect = (node: AVGTreeNodeModel) => {
    console.log("selected node: ", node);
    setSelectedNode(node);
  };
  const handleDrop = (newTreeData: React.SetStateAction<AVGTreeNodeModel[]>) =>
    setTreeData(newTreeData);

  const handleClickBlank = () => {
    setSelectedNode(null);
  };

  return (
    <div className="container">
      <div className={"toolbar"}>
        <ButtonGroup minimal={false} large={false} vertical={false}>
          <Button text="故事" rightIcon="insert" />
          <Button text="目录" rightIcon="folder-new" />
        </ButtonGroup>
      </div>

      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <div className={"tree-container"} onClick={handleClickBlank}>
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
    </div>
  );
};
