import React, { useState, useContext } from "react";
import {
  MenuDivider,
  Menu,
  MenuItem,
  Alert,
  Dialog,
  Tag,
  Intent
} from "@blueprintjs/core";
import { shell, app, remote } from "electron";
import { AutoUpdater } from "../../services/autoupdater";
import { GUIToaster } from "../../services/toaster";
import { CreatorContext } from "../../hooks/context";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { StoryItem } from "../story-items/story-item";

interface IStoryItemMenuProps {
  item: StoryItem;
}

export const StoryItemContextMenu = (props: IStoryItemMenuProps) => {
  return (
    <>
      <Menu>
        <MenuDivider title="调试" />
        <MenuItem text="从头运行到此处" icon="play" />
        <MenuItem text="本章开头运行到此处" icon="play" />
        <MenuDivider title="编辑" />
        <MenuItem text="剪切" label="⌘X" icon="cut" />
        <MenuItem text="复制" label="⌘C" icon="duplicate" />
        <MenuItem text="粘贴" label="⌘V" icon="clipboard" />
        <MenuDivider />
        <MenuItem text="插入" icon="insert">
          <MenuDivider title="文本" />
          <MenuItem text="显示对话" />
          <MenuDivider title="角色" />
          <MenuItem text="显示立绘" />
          <MenuItem text="执行立绘动画" />
          <MenuItem text="隐藏立绘" />
          <MenuDivider title="高级" />
          <MenuItem text="自定义脚本" />
        </MenuItem>
        <MenuItem intent="danger" text="删除" label="Del" icon="trash" />
        {/* <MenuDivider />
        <MenuItem text="重新加载" icon="refresh" /> */}
      </Menu>
    </>
  );
};
