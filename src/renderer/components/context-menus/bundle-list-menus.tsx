import React from "react";
import { Menu } from "@blueprintjs/core";
import {
  BundleItem,
  BundleStatus
} from "../bundles-manager-dialog/bundles-manager-dialog";

interface IBundleListItemContextMenuProps {
  bundle: BundleItem;
  onDownload: (bundle: BundleItem) => void;
  onDelete: () => void;
}

export const BundleListItemContextMenu = (
  props: IBundleListItemContextMenuProps
) => {
  return (
    <>
      <Menu>
        {props.bundle.status === BundleStatus.NotDownload && (
          <Menu.Item icon="import" text="下载" />
        )}

        {props.bundle.status === BundleStatus.Downloaded && (
          <Menu.Item intent="danger" icon="import" text="删除..." />
        )}
      </Menu>
    </>
  );
};
