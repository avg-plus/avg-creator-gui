import React from "react";
import { Menu } from "@blueprintjs/core";
import {
  BundleItem,
  BundleStatus
} from "../bundles-manager-dialog/bundles-manager-dialog";
import {
  BundleType,
  BundlesManager
} from "../../services/bundles-manager/bundles-manager";

interface IBundleListItemContextMenuProps {
  bundle: BundleItem;
  onDownload: () => void;
  onDelete: () => void;
  onSetAsDefault: () => void;
}

export const BundleListItemContextMenu = (
  props: IBundleListItemContextMenuProps
) => {
  if (props.bundle.status === BundleStatus.Downloading) {
    return null;
  }

  return (
    <Menu>
      {props.bundle.status === BundleStatus.Downloaded &&
        props.bundle.type == BundleType.Engines && (
          <>
            <Menu.Item
              icon="bookmark"
              text="设为默认"
              onClick={props.onSetAsDefault}
            />
            <Menu.Divider />
          </>
        )}

      {props.bundle.status === BundleStatus.NotDownload && (
        <Menu.Item icon="import" text="下载" onClick={props.onDownload} />
      )}

      {props.bundle.status === BundleStatus.Downloaded && (
        <Menu.Item
          intent="danger"
          icon="import"
          text="删除本地文件"
          onClick={props.onDelete}
        />
      )}
    </Menu>
  );
};
