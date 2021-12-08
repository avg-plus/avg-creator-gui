import React from "react";
import { DragLayerMonitorProps } from "@minoru/react-dnd-treeview";
import "./drag-preview.less";
import { AVGTreeNodeModel } from "../../../../../common/models/tree-node-item";

type Props = {
  monitorProps: DragLayerMonitorProps<AVGTreeNodeModel>;
};

export const CustomDragPreview: React.FC<Props> = (props) => {
  const item = props.monitorProps.item;

  return (
    <div className={`root`}>
      <div className={`icon`}>
        {/* <TypeIcon droppable={item.droppable} fileType={item?.data?.text} /> */}
      </div>
      <div className={"label"}>{item.text}</div>
    </div>
  );
};
