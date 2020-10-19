import React, { Props, useRef } from "react";
import classnames from "classnames";
import {
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle
} from "react-beautiful-dnd";

import "./story-item-component.less";
import { StoryItem } from "../../../components/story-items/story-item";
import { useMount } from "react-use";

export interface IStoryItemComponentProps {
  item: StoryItem;
  index?: number;
  style?: Object;
}

const StoryItemComponent = (props: IStoryItemComponentProps) => {
  const { item, style } = props;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={classnames("story-item-wrapper")} style={style}>
      <div
        className={classnames("item-render", {
          //   selected: item.id === currentSelected
        })}
      >
        {item.render()}
      </div>
      {/* <div className={"drag-handle"}>:::</div> */}
    </div>
  );
};

export default React.memo<IStoryItemComponentProps>(StoryItemComponent);
