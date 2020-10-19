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

import { useRef, useState } from "react";
import { StoryManager } from "../../../services/storyboard/story-manager";
import { StoryItem } from "../../../components/story-items/story-item";
import StoryItemComponent, {
  IStoryItemComponentProps
} from "./story-item-component";

import "./storyboard-view.less";
import { useMount } from "react-use";

const story = StoryManager.loadStory();
const storyItems = story.getAllItems();

interface IVirtualListProps {
  items: StoryItem[];
  getRef: (ref: List) => void;
}

const DragHandle = SortableHandle(() => <div className={"drag-handle"}></div>);
const SortableStoryItemComponent = SortableElement(
  (value: IStoryItemComponentProps) => (
    <li>
      <StoryItemComponent {...value}></StoryItemComponent>
      <DragHandle />
    </li>
  )
);

const VirtualList = (props: IVirtualListProps) => {
  const ref = useRef() as React.RefObject<List>;
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 80
  });

  useMount(() => {
    if (ref.current) {
      props.getRef(ref.current);
    }

    setInterval(() => {
      ref.current?.recomputeRowHeights();
    }, 2000);
  });

  const renderRow = ({ index, style, parent, key }: ListRowProps) => {
    const item: StoryItem = props.items[index];

    return (
      <CellMeasurer
        cache={cache}
        key={key}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
        style={style}
      >
        <SortableStoryItemComponent
          key={key}
          item={item}
          style={{ margin: 0, ...style }}
          index={index}
        ></SortableStoryItemComponent>
      </CellMeasurer>
    );
  };

  const getRowHeight = ({ index }) => {
    return props.items[index].renderHeight || 40;
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={ref}
          deferredMeasurementCache={cache}
          // rowHeight={getRowHeight}
          rowHeight={cache.rowHeight}
          rowRenderer={renderRow}
          rowCount={props.items.length}
          width={width}
          height={height}
        />
      )}
    </AutoSizer>
  );
};

const SortableVirtualList = SortableContainer(VirtualList);

export const StoryboardView = () => {
  const [items, setItems] = useState(storyItems);
  const [listRef, setListRef] = useState<List>();

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

      console.log("recomputeRowHeights");
    }
  };

  return (
    <SortableVirtualList
      items={items}
      useDragHandle={true}
      getRef={setListRef}
      onSortEnd={onSortEnd}
    ></SortableVirtualList>
  );
};
