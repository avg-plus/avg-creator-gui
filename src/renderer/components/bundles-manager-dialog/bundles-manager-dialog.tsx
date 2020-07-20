import React, { useState, useContext, useEffect } from "react";
import { List } from "antd";

import semver from "semver";

import {
  IBundle,
  BundlesManager,
  BundleType
} from "../../services/bundles-manager/bundles-manager";
import { useMount } from "react-use";

import "./bundles-manager-dialog.less";
import { BundleListItem } from "./bundle-list-item";
import { Button, ButtonGroup, Tabs, Tab } from "@blueprintjs/core";
import { CreatorContext } from "../../hooks/context";
import { LocalAppConfig } from "../../../common/local-app-config";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";

enum BundleFilterType {
  Templates = "Templates",
  Engines = "Engines"
}

export enum BundleStatus {
  NotDownload,
  Downloading,
  Downloaded
}

export interface BundleItem extends IBundle {
  status: BundleStatus;
  bundleInfo: any;
  downloadProgress: number;
  transferred: number;
}

export const BundleManagerDialog = () => {
  const { state, dispatch } = useContext(CreatorContext);

  const [currentFilter, setCurrentFilter] = useState(BundleFilterType.Engines);
  const [bundleList, setBundleList] = useState<BundleItem[]>([]);
  const [isBundleListLoading, setIsBundleListLoading] = useState(false);

  useMount(async () => {
    await fetchManifest();
  });

  // 拉取资源列表
  const fetchManifest = async () => {
    setIsBundleListLoading(true);
    setBundleList([]);

    const localBundles = await BundlesManager.loadLocalBundles();
    const manifest = await BundlesManager.fetchManifest();

    const list = [];
    for (const bundle of manifest.bundles) {
      const bundleItem = bundle as BundleItem;
      bundleItem.status = BundleStatus.NotDownload;

      const localBundle = localBundles.get(bundleItem.hash);
      if (localBundle) {
        bundleItem.status = BundleStatus.Downloaded;
        bundleItem.bundleInfo = localBundle.bundleInfo;
      }

      list.push(bundleItem);
    }

    setBundleList(list);
    // setBundleList(list);

    setTimeout(() => {
      // 设置默认
      const defaultEngineBundleHash = LocalAppConfig.get(
        "defaultEngine"
      ) as string;
      if (defaultEngineBundleHash && defaultEngineBundleHash.length) {
        dispatch({
          type: AVGCreatorActionType.SetDefaultEngine,
          payload: {
            bundleHash: defaultEngineBundleHash
          }
        });
      }
    }, 100);

    setIsBundleListLoading(false);
  };

  const handleFilterChanged = (filter: BundleFilterType) => {
    setCurrentFilter(filter);
  };

  const getBundleList = () => {
    const list = bundleList.filter((v) => {
      if (currentFilter === BundleFilterType.Engines) {
        return v.type === BundleType.Engines;
      } else if (currentFilter === BundleFilterType.Templates) {
        return v.type === BundleType.Templates;
      }

      return true;
    });

    return list;
  };

  return (
    <>
      <div className="button-group-toolbar">
        <ButtonGroup fill={true} minimal={false}>
          <Button
            active={currentFilter === BundleFilterType.Engines}
            icon="application"
            onClick={() => handleFilterChanged(BundleFilterType.Engines)}
          >
            引擎
          </Button>

          <Button
            active={currentFilter === BundleFilterType.Templates}
            icon="projects"
            onClick={() => handleFilterChanged(BundleFilterType.Templates)}
          >
            模板项目
          </Button>
        </ButtonGroup>

        <Button icon="application" onClick={fetchManifest}>
          刷新列表
        </Button>
      </div>

      <List
        className="bundle-list"
        itemLayout="horizontal"
        style={{ height: "100%" }}
        loading={isBundleListLoading}
        dataSource={getBundleList()}
        renderItem={(item) => (
          <BundleListItem key={item.hash} item={item}></BundleListItem>
        )}
      />
    </>
  );
};
