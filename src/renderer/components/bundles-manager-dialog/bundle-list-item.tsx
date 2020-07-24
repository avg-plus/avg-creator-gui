import React, { useContext, useEffect, useState } from "react";
import _ from "underscore";
import { List, Progress as AntdProgress } from "antd";

import { formatBytes } from "../../../common/utils";
import { BundleItem, BundleStatus } from "./bundles-manager-dialog";
import { CreatorContext } from "../../hooks/context";
import { Icon, ContextMenu, Intent, Tag, Classes } from "@blueprintjs/core";
import { BundleListItemContextMenu } from "../context-menus/bundle-list-menus";
import {
  BundlesManager,
  BundleDownloadContext,
  BundleType
} from "../../services/bundles-manager/bundles-manager";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { GUIToaster } from "../../services/toaster";
import { useForceUpdate } from "../../hooks/use-forceupdate";

import "./bundle-list-item.less";
import { DBProjects } from "../../../common/database/db-project";
import { LocalAppConfig } from "../../../common/local-app-config";
import classNames from "classnames";

export interface IBundleListItemProps {
  item: BundleItem;
}

export const BundleListItem = (props: IBundleListItemProps) => {
  const { state, dispatch } = useContext(CreatorContext);
  const forceUpdate = useForceUpdate();

  const renderDownloadStatus = (item: BundleItem) => {
    if (item.status === BundleStatus.Downloaded) {
      return <Icon icon="tick" color={"green"}></Icon>;
    } else if (item.status === BundleStatus.Downloading) {
      return (
        <div style={{ width: 170 }}>
          <AntdProgress
            percent={+(item.downloadProgress * 100).toFixed(1)}
            size="small"
          />
          {formatBytes(item.transferred, 1)}/{formatBytes(item.size, 1)}
        </div>
      );
    }

    return <Icon icon="double-chevron-down"></Icon>;
  };

  const handleBundleDownload = async (bundle: BundleItem) => {
    const onUpdateCallback = _.throttle((context: BundleDownloadContext) => {
      bundle.downloadProgress = context.progress.percent;
      bundle.status = BundleStatus.Downloading;
      bundle.transferred = context.progress.transferred;

      if (context.progress.percent >= 1) {
        bundle.status = BundleStatus.Downloaded;
      }

      forceUpdate();
    }, 500);

    await BundlesManager.downloadBundle(bundle, onUpdateCallback);
  };

  const handleBundleDelete = async (bundle: BundleItem) => {
    await BundlesManager.deleteLocalBundle(bundle);
    bundle.status = BundleStatus.NotDownload;

    GUIToaster.show({
      message: "删除成功",
      icon: "tick",
      timeout: 5000,
      intent: Intent.SUCCESS
    });

    forceUpdate();
  };

  const handleSetAsDefault = async (bundle: BundleItem) => {
    if (bundle.type !== BundleType.Engines) {
      return;
    }

    LocalAppConfig.set("defaultEngine", bundle.hash);
    LocalAppConfig.save(() => {
      dispatch({
        type: AVGCreatorActionType.SetDefaultEngine,
        payload: {
          bundleHash: bundle.hash
        }
      });
    });
  };

  const renderTitle = () => {
    if (props.item.type === BundleType.Engines) {
      const isDefault = state.defaultEngineBundleHash === props.item.hash;
      return (
        <>
          {props.item.name} {"   "}
          {isDefault && props.item.status === BundleStatus.Downloaded && (
            <Tag intent={Intent.SUCCESS}>默认</Tag>
          )}
        </>
      );
    } else if (props.item.type === BundleType.Templates) {
      if (props.item.bundleInfo) {
        return <>{props.item.bundleInfo.name}</>;
      }
    }

    return props.item.name;
  };

  const renderDescription = () => {
    return (
      <>
        大小：{formatBytes(props.item.size, 1)}
        {props.item.status === BundleStatus.Downloaded &&
          props.item.bundleInfo &&
          `, v${props.item.bundleInfo.version}`}
      </>
    );
  };

  const [selected, setSelected] = useState(false);

  return (
    <List.Item
      className={classNames("bundle-item", {
        selected: selected
      })}
      key={props.item.hash}
      actions={[renderDownloadStatus(props.item)]}
      onDoubleClick={() => handleSetAsDefault(props.item)}
      onContextMenu={(event) => {
        setSelected(true);
        ContextMenu.show(
          <BundleListItemContextMenu
            bundle={props.item}
            onDownload={() => handleBundleDownload(props.item)}
            onDelete={() => handleBundleDelete(props.item)}
            onSetAsDefault={() => handleSetAsDefault(props.item)}
          />,
          {
            left: event.clientX,
            top: event.clientY
          },
          () => {
            setSelected(false);
          }
        );
      }}
    >
      <List.Item.Meta title={renderTitle()} description={renderDescription()} />
    </List.Item>
  );
};
