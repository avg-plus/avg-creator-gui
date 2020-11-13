import React, { useState, useContext } from "react";
import { MenuDivider, Menu, MenuItem } from "@blueprintjs/core";
import { StoryItem } from "../story-items/story-item";

type StoryItemMenuEvent = (item: StoryItem) => void;
const StoryItemMenuEventWrapper = (
  item: StoryItem,
  event?: StoryItemMenuEvent
) => {
  return (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event && event(item);
  };
};

interface IStoryItemMenuProps {
  item: StoryItem;
  onDelete?: StoryItemMenuEvent;
}

export const StoryItemContextMenu = (props: IStoryItemMenuProps) => {
  let extendMenus: JSX.Element[] = [];
  if (
    props.item.renderExtendContextMenu &&
    props.item.renderExtendContextMenu().length
  ) {
    extendMenus = props.item.renderExtendContextMenu();
  }

  const renderExtendMenus = () => {
    if (extendMenus && extendMenus.length) {
      return [<MenuDivider title="创作" />, ...extendMenus];
    }

    return [];
  };

  return (
    <>
      <Menu>
        {...renderExtendMenus()}
        <MenuDivider title="调试" />
        <MenuItem text="从头运行到此处" icon="play" />
        <MenuItem text="本章开头运行到此处" icon="play" />
        <MenuDivider title="编辑" />
        <MenuItem text="剪切" label="⌘X" icon="cut" />
        <MenuItem text="复制" label="⌘C" icon="duplicate" />
        <MenuItem text="粘贴" label="⌘V" icon="clipboard" />
        <MenuDivider />
        <MenuItem
          intent="danger"
          text="删除"
          label="Del"
          icon="trash"
          onClick={StoryItemMenuEventWrapper(props.item, props.onDelete)}
        />
        {/* <MenuDivider />
        <MenuItem text="重新加载" icon="refresh" /> */}
      </Menu>
    </>
  );
};
