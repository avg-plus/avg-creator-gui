import React, { useState } from "react";
import { MenuDivider, Menu, MenuItem, Alert } from "@blueprintjs/core";
import { shell, app, remote } from "electron";
import { AutoUpdater } from "../../services/autoupdater";

interface IMainContextMenuProps {
  onOpenAboutDialog: () => void;
}

export const MainContextMenu = (props: IMainContextMenuProps) => {
  const openURL = (url: string) => {
    shell.openExternal(url);
  };

  const handleCheckUpdate = async () => {
    await AutoUpdater.checkingForUpdate();
  };

  return (
    <>
      <Menu>
        {/* <MenuDivider title="设置" />
        <MenuItem text="偏好设置..." icon="settings" /> */}

        <MenuDivider title="版本" />
        <MenuItem text="版本日志" icon="document" />
        <MenuItem
          text="检查更新..."
          icon="automatic-updates"
          onClick={handleCheckUpdate}
        />

        <MenuDivider title="链接" />
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
