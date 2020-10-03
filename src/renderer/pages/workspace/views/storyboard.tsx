import * as React from "react";
import { useMount } from "react-use";
import classname from "classnames";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
  DropResult,
  ResponderProvided
} from "react-beautiful-dnd";

import "./storyboard.less";
import { useEffect, useState } from "react";
import { StoryManager } from "../../../services/storyboard/story-manager";
import { GlobalEvents } from "../../../../common/global-events";
import { StoryItem } from "../../../components/story-items/story-item";
import Row from "antd/lib/row";
import Col from "antd/lib/col";

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

const grid = 4;

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid
});

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle
) => ({
  // some basic styles to make the items look a bit nicer
  // userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

const story = StoryManager.loadStory();
const storyItems = story.getItems();

console.log(storyItems);

export const StoryboardView = () => {
  const [items, setItems] = useState(storyItems);

  useEffect(() => {
    const token = PubSub.subscribe(
      GlobalEvents.StoryItemListShouldRender,
      (event: GlobalEvents, data: any) => {
        setItems(story.getItems());
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
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(newItems);
    story.setItems(...newItems);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <Row>
                        <Col span={22}>{item.render()}</Col>
                        <Col span={2}>
                          <div
                            className={"drag-handle"}
                            {...provided.dragHandleProps}
                          ></div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
