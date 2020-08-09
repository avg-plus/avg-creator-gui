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

interface IMainContextMenuProps {
  onOpenAboutDialog: () => void;
}

export default (props: IMainContextMenuProps) => {
  const { state, dispatch } = useContext(CreatorContext);

  const openURL = (url: string) => {
    shell.openExternal(url);
  };

  const handleCheckUpdate = async () => {
    const localPendingUpdates = AutoUpdater.getLocalPendingUpdates();
    if (localPendingUpdates) {
      dispatch({
        type: AVGCreatorActionType.CheckUpdateAlert,
        payload: {
          open: true,
          status: "InstallLocalPending",
          updateItem: localPendingUpdates
        }
      });
      return;
    }

    const item = await AutoUpdater.checkingForUpdates();

    dispatch({
      type: AVGCreatorActionType.CheckUpdateAlert,
      payload: {
        open: true,
        status: "Alert",
        updateItem: item
      }
    });
  };

  return (
    <>
      <Menu>
        <MenuDivider title="版本" />
        <MenuItem text="版本日志" icon="history" />
        <MenuItem
          text="检查更新..."
          icon="automatic-updates"
          // labelElement={<Tag intent={Intent.DANGER}>有新版本</Tag>}
          onClick={handleCheckUpdate}
        />

        <MenuDivider title="线上资源" />
        <MenuItem
          text="主页"
          icon="globe-network"
          onClick={(e: any) => openURL("https://avg-engine.com")}
        />
        <MenuItem
          text="社区"
          icon="chat"
          onClick={(e: any) => openURL("https://community.avg-engine.com/")}
        />
        <MenuItem
          text="使用文档"
          icon="document"
          onClick={(e: any) => openURL("https://docs.avg-engine.com/")}
        />
        <MenuItem
          text="线上引擎"
          icon="play"
          onClick={(e: any) => openURL("https://play.avg-engine.com/")}
        />
        <MenuDivider />

        <MenuItem
          text="关于 AVGPlus Creator"
          icon="info-sign"
          onClick={() => {
            props.onOpenAboutDialog();
          }}
        />

        <MenuDivider />
        <MenuItem
          text="退出"
          icon="walk"
          intent="danger"
          onClick={() => {
            remote.app.quit();
          }}
        />
      </Menu>
    </>
  );
};
