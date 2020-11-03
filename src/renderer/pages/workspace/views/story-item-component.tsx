import React, { useRef, useState } from "react";
import classnames from "classnames";

import { StoryItem } from "../../../components/story-items/story-item";
import { ContextMenu } from "@blueprintjs/core";
import { StoryItemContextMenu } from "../../../components/context-menus/story-item-menus";

import "./story-item-component.less";

export interface IStoryItemComponentProps {
  item: StoryItem;
  index?: number;
  style?: Object;
}

const StoryItemComponent = (props: IStoryItemComponentProps) => {
  const { item, style } = props;
  const [selected, setSelected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={classnames("story-item-wrapper")}
      style={{ ...style, paddingLeft: `${10 * item.depth}px` }}
      onMouseDown={(event) => {
        if (event.button === 2) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      onContextMenu={(event) => {
        setSelected(true);
        event.preventDefault();
        ContextMenu.show(
          <StoryItemContextMenu item={item} />,
          {
            left: event.clientX,
            top: event.clientY
          },
          () => {
            setSelected(false);
          }
        );
      }}
    >
      <div
        className={classnames({
          "item-selected": selected
        })}
      >
        <div className={"outline"}></div>
        <div className={classnames("item-render")}>{item.render()}</div>
      </div>

      {/* <div className={"drag-handle"}>:::</div> */}
    </div>
  );
};

export default React.memo<IStoryItemComponentProps>(StoryItemComponent);
