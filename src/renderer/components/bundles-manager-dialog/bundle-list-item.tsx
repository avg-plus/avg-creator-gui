import React, { useContext, useEffect, useState } from "react";
import _ from "underscore";
import Progress from "antd/lib/progress";
import List from "antd/lib/list";

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
import { LocalAppConfig } from "../../../common/local-app-config";
import classNames from "classnames";

export interface IBundleListItemProps {
  item: BundleItem;
}

export const BundleListItem = (props: IBundleListItemProps) => {
  const { state, dispatch } = useContext(CreatorContext);
  const forceUpdate = useForceUpdate();

  const renderDownloadStatus = (item: BundleItem) => {
    if (item.status === BundleStatus.Preparing) {
      return "正在连接...";
    } else if (item.status === BundleStatus.Downloaded) {
      return <Icon icon="tick" color={"green"}></Icon>;
    } else if (item.status === BundleStatus.Downloading) {
      return (
        <div style={{ width: 170 }}>
          <Progress
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
    const onUpdateCallback = _.throttle(
      async (context: BundleDownloadContext) => {
        bundle.downloadProgress = context.progress.percent;
        bundle.status = BundleStatus.Downloading;
        bundle.transferred = context.progress.transferred;

        // 下载完成
        if (context.progress.percent >= 1) {
          bundle.status = BundleStatus.Downloaded;

          await BundlesManager.loadLocalBundles();
        }

        forceUpdate();
      },
      300
    );

    bundle.status = BundleStatus.Preparing;
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
    if (bundle.type !== BundleType.Engine) {
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

      GUIToaster.show({
        message: `设置 ${bundle.name} 为默认引擎`,
        timeout: 2000,
        intent: Intent.SUCCESS
      });
    });
  };

  const renderTitle = () => {
    const title = () => {
      if (
        props.item.bundleInfo &&
        props.item.status === BundleStatus.Downloaded
      ) {
        return <>{props.item.bundleInfo.name}</>;
      } else {
        return <>{props.item.name}</>;
      }
    };

    if (props.item.type === BundleType.Engine) {
      const isDefault = state.defaultEngineBundleHash === props.item.hash;
      return (
        <>
          {title()} {"   "}
          {isDefault && props.item.status === BundleStatus.Downloaded && (
            <Tag intent={Intent.SUCCESS}>默认</Tag>
          )}
        </>
      );
    } else if (props.item.type === BundleType.Template) {
      return title();
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
