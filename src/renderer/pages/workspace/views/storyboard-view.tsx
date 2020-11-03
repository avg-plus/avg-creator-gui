import * as React from "react";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps
} from "react-virtualized";

import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";

import arrayMove from "array-move";

import { useEffect, useRef, useState } from "react";
import { StoryManager } from "../../../services/storyboard/story-manager";
import { StoryItem } from "../../../components/story-items/story-item";
import StoryItemComponent, {
  IStoryItemComponentProps
} from "./story-item-component";

import "./storyboard-view.less";
import { useMount } from "react-use";
import Scrollbars from "react-custom-scrollbars";
import { autoSubScribe } from "../../../../common/utils";
import { GlobalEvents } from "../../../../common/global-events";
import _ from "underscore";

const story = StoryManager.loadStory();

interface IVirtualListProps {
  items: StoryItem[];
  getRef: (ref: List) => void;
}

const DragHandle = SortableHandle(() => (
  <div className={"drag-handle"}>:: ---</div>
));
const SortableStoryItemComponent = SortableElement(
  (value: IStoryItemComponentProps) => (
    <StoryItemComponent {...value}>
      <DragHandle />
    </StoryItemComponent>
  )
);

const VirtualList = (props: IVirtualListProps) => {
  const ref = useRef() as React.RefObject<List>;

  useMount(() => {
    if (ref.current) {
      props.getRef(ref.current);
    }
  });

  useEffect(() => {
    return autoSubScribe(
      GlobalEvents.RecomputeStoryNodeHeights,
      (event, data) => {
        const item = data?.item as StoryItem;
        const index = props.items.indexOf(item);
        if (index >= 0) {
          ref.current?.recomputeRowHeights(index);
        }
      }
    );
  });

  const renderRow = ({ index, style, parent, key }: ListRowProps) => {
    const item: StoryItem = props.items[index];

    return (
      <SortableStoryItemComponent
        key={item.id}
        item={item}
        style={{ margin: 0, ...style }}
        index={index}
      ></SortableStoryItemComponent>
    );
  };

  const getRowHeight = ({ index }) => {
    return props.items[index].renderHeight() || 40;
  };

  const rowCount = () => {
    return props.items.length;
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={ref}
          overscanRowCount={120}
          rowHeight={getRowHeight}
          rowRenderer={renderRow}
          rowCount={rowCount()}
          onRowsRendered={(info) => {
            for (
              let i = info.overscanStartIndex;
              i <= info.overscanStopIndex;
              ++i
            ) {
              ref.current?.recomputeRowHeights(i);
            }
          }}
          width={width}
          height={height - 40}
        />
      )}
    </AutoSizer>
  );
};

const SortableVirtualList = SortableContainer(VirtualList);

const allItems = story.getAllItems();
export const StoryboardView = () => {
  const [items, setItems] = useState<StoryItem[]>(allItems);
  const [listRef, setListRef] = useState<List>();

  useEffect(() => {
    return autoSubScribe(
      GlobalEvents.StoryItemListShouldRender,
      (event, data) => {
        const allItems = story.getAllItems();

        setItems(allItems);
        console.log(
          "on changed StoryItemListShouldRender",
          story.getAllItems()
        );

        listRef?.recomputeRowHeights();
        listRef?.forceUpdate();
      }
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    setItems(arrayMove(items, oldIndex, newIndex));

    // We need to inform React Virtualized that the items have changed heights
    // This can either be done by imperatively calling the recomputeRowHeights and
    // forceUpdate instance methods on the `List` ref, or by passing an additional prop
    // to List that changes whenever the order changes to force it to re-render
    if (listRef) {
      listRef.recomputeRowHeights();
      listRef.forceUpdate();
    }
  };

  return (
    <div id={"editor"}>
      <SortableVirtualList
        useWindowAsScrollContainer={true}
        items={items}
        useDragHandle={true}
        getRef={setListRef}
        onSortEnd={onSortEnd}
      ></SortableVirtualList>
    </div>
  );
};
