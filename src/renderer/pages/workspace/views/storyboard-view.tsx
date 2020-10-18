import * as React from "react";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
  DropResult,
  ResponderProvided,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  DroppableProvided
} from "react-beautiful-dnd";

import { useEffect, useState } from "react";
import { StoryManager } from "../../../services/storyboard/story-manager";
import { GlobalEvents } from "../../../../common/global-events";
import { StoryItem } from "../../../components/story-items/story-item";
import Scrollbars from "react-custom-scrollbars";
import { APISelectorPanel } from "../../../components/api-selector/api-selector-panel";
import StoryItemComponent, {
  IStoryItemComponentProps
} from "./story-item-component";

import "./storyboard-view.less";
import ReactDOM from "react-dom";

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

const grid = 1;

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid
});

const story = StoryManager.loadStory();
const storyItems = story.getAllItems();

export const StoryboardView = () => {
  const [items, setItems] = useState(storyItems);
  const [currentSelected, setCurrentSelected] = useState(
    story.selectedItem?.id
  );

  useEffect(() => {
    setItems(storyItems);
  }, [storyItems]);

  useEffect(() => {
    const token = PubSub.subscribe(
      GlobalEvents.StoryItemListShouldRender,
      (event: GlobalEvents, data: any) => {
        // const newItems = produce(items, (draftState) => {});
        setItems(story.getAllItems());
      }
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  // a little function to help us with reordering the result
  const reorder = (
    list: Iterable<StoryItem> | ArrayLike<StoryItem>,
    startIndex: number,
    endIndex: number
  ) => {
    const result: StoryItem[] = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    story.setItems(...newItems);

    setItems(story.getAllItems());
  };

  type RowProps = {
    index: number;
    style: Object;
  };
  const getRowRenderer = (items: StoryItem[]) => ({
    index,
    style
  }: RowProps) => {
    const item: StoryItem = items[index];

    return (
      <Draggable key={`${item.id}`} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <StoryItemComponent
            item={item}
            provided={provided}
            snapshot={snapshot}
            style={{ margin: 0, ...style }}
            index={index}
          ></StoryItemComponent>
        )}
      </Draggable>
    );
  };

  return (
    <>
      {/* <div className="api-selector-panel-container">
        <APISelectorPanel></APISelectorPanel>
      </div> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="droppable"
          mode="virtual"
          renderClone={(
            provided: DraggableProvided,
            snapshot: DraggableStateSnapshot,
            rubric: DraggableRubric
          ) => (
            <StoryItemComponent
              item={items[rubric.source.index]}
              provided={provided}
              snapshot={snapshot}
            ></StoryItemComponent>
          )}
        >
          {(droppableProvided: DroppableProvided) => (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  // id="editor"
                  height={height}
                  rowCount={items.length}
                  rowHeight={100}
                  width={width}
                  ref={(ref) => {
                    // react-virtualized has no way to get the list's ref that I can so
                    // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                    if (ref) {
                      // eslint-disable-next-line react/no-find-dom-node
                      const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                      if (whatHasMyLifeComeTo instanceof HTMLElement) {
                        droppableProvided.innerRef(whatHasMyLifeComeTo);
                      }
                    }
                  }}
                  rowRenderer={getRowRenderer(items)}
                />
              )}
            </AutoSizer>

            // </Scrollbars>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
