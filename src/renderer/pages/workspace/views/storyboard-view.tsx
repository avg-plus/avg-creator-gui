import * as React from "react";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  OnScrollParams,
  ListRowProps
} from "react-virtualized";

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd,
  SortEvent,
  SortStart
} from "react-sortable-hoc";

import arrayMove from "array-move";

import { useEffect, useRef, useState } from "react";
import { StoryManager } from "../../../services/storyboard/story-manager";
import { StoryItem } from "../../../components/story-items/story-item";
import StoryItemComponent, {
  IStoryItemComponentProps
} from "./story-item-component";

import "./storyboard-view.less";
import { useEffectOnce, useMount } from "react-use";
import Scrollbars from "react-custom-scrollbars";
import { autoSubScribe } from "../../../../common/utils";
import { GlobalEvents } from "../../../../common/global-events";
import _ from "underscore";
import { ResizeSensor } from "css-element-queries";

const story = StoryManager.loadStory();

interface IVirtualListProps {
  items: StoryItem[];
  getRef: (ref: List) => void;
}

const SortableStoryItemComponent = SortableElement(
  (value: IStoryItemComponentProps) => (
    <StoryItemComponent {...value}></StoryItemComponent>
  )
);

const VirtualList = (props: IVirtualListProps) => {
  const ref = useRef() as React.RefObject<List>;
  const [listHeight, setListHeight] = useState(0);
  const [listWidth, setListWidth] = useState(0);

  useMount(() => {
    if (ref.current) {
      props.getRef(ref.current);
    }

    new ResizeSensor($("#editor").get()[0], (size) => {
      const height = size.height - 50;
      const width = size.width;

      setListHeight(height);
      setListWidth(width);
      StoryManager.renderStoryItemList(true);
    });
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
        style={{ margin: 0, overflowX: "hidden", ...style }}
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
    <List
      ref={ref}
      overscanRowCount={10}
      rowHeight={getRowHeight}
      rowRenderer={renderRow}
      rowCount={rowCount()}
      onScroll={(params: OnScrollParams) => {
        story.updateScrollParamsFromView(params);
      }}
      onRowsRendered={(info) => {
        story.updateRenderedInfoFromView(info);

        for (
          let i = info.overscanStartIndex;
          i <= info.overscanStopIndex;
          ++i
        ) {
          ref.current?.recomputeRowHeights(i);
        }
      }}
      width={listWidth}
      height={listHeight}
    />
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

        listRef?.recomputeRowHeights();
        listRef?.forceUpdate();
      }
    );
  });

  useEffect(() => {
    return autoSubScribe(GlobalEvents.ScrollToStoryItem, (event, data) => {
      if (data && data.index >= 0) {
        listRef?.scrollToRow(data.index);
      }
    });
  });

  const onSortStart = (sort: SortStart, event: SortEvent) => {};

  const onSortEnd = (sort: SortEnd, event: SortEvent) => {
    const oldIndex = sort.oldIndex;
    const newIndex = sort.newIndex;

    if (oldIndex === newIndex) {
      return;
    }

    const newItems = arrayMove(items, oldIndex, newIndex);
    story.setItems(newItems);
    setItems(newItems);

    const currentStoryItem = newItems[newIndex];
    currentStoryItem.focus();
    currentStoryItem.onDrop();

    $(currentStoryItem.getRef()).addClass("drag-placed");
    setTimeout(() => {
      $(currentStoryItem.getRef()).removeClass("drag-placed");
    }, 1000);

    // 重新计算视图内所有行的高度，放置拖动后导致高度不一致
    const renderedInfo = story.getRenderedInfo();
    for (let i = renderedInfo.startIndex; i < renderedInfo.stopIndex; ++i) {
      listRef?.recomputeRowHeights(i);
    }
  };

  return (
    <div id={"editor"}>
      <SortableVirtualList
        helperClass="item-draging"
        axis="y"
        lockAxis="y"
        items={items}
        useDragHandle={true}
        getRef={setListRef}
        onSortEnd={onSortEnd}
        onSortStart={onSortStart}
      ></SortableVirtualList>
    </div>
  );
};
