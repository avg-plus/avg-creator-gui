import React, { Props } from "react";
import classnames from "classnames";
import {
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle
} from "react-beautiful-dnd";

import "./story-item-component.less";
import { StoryItem } from "../../../components/story-items/story-item";

export interface IStoryItemComponentProps {
  item: StoryItem;
  index?: number;
  style?: Object;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const grid = 1;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle,
  virtualizeStyles?: Object
) => ({
  // * 必须附加 virtualizeStyles, 负责会导致列表闪烁

  // some basic styles to make the items look a bit nicer
  // userSelect: "none",
  padding: grid * 1,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  // background: isDragging ? "lightgreen" : "white",
  // background: "white",

  // styles we need to apply on draggables
  ...draggableStyle,
  ...virtualizeStyles
});

const StoryItemComponent = (props: IStoryItemComponentProps) => {
  const { item, style, provided, snapshot } = props;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={getItemStyle(
        snapshot.isDragging,
        provided.draggableProps.style,
        style
      )}
      className={classnames(
        "story-item-wrapper",
        // { selected: item.id === currentSelected },
        { dragging: snapshot.isDragging }
      )}
    >
      <div
        className={classnames("item-render", {
          //   selected: item.id === currentSelected
        })}
        onMouseDown={() => {
          //   story.setSelected(item);
          //   setCurrentSelected(item.id);
        }}
      >
        {item.render()}
      </div>
      <div className={"drag-handle"} {...provided.dragHandleProps}></div>
    </div>
  );
};

export default React.memo<IStoryItemComponentProps>(StoryItemComponent);
