import React, { useState, useContext, useEffect } from "react";
import List from "antd/lib/list";

import semver, { sort as semverSort } from "semver";

import {
  IBundle,
  BundlesManager,
  BundleType,
  BundleInfo
} from "../../services/bundles-manager/bundles-manager";
import { useMount } from "react-use";

import "./bundles-manager-dialog.less";
import { BundleListItem } from "./bundle-list-item";
import {
  Button,
  ButtonGroup,
  Tabs,
  Tab,
  Intent,
  NonIdealState
} from "@blueprintjs/core";
import { CreatorContext } from "../../hooks/context";
import { LocalAppConfig } from "../../../common/local-app-config";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { GUIToaster } from "../../services/toaster";
import { BundleDesktopPage } from "./bundle-desktop-page";
import { delayExecution } from "../../../common/utils";

enum BundleFilterType {
  Templates = "Templates",
  Engines = "Engines",
  DesktopShell = "DesktopShell"
}

export enum BundleStatus {
  NotDownload,
  Preparing,
  Downloading,
  Downloaded
}

export interface BundleItem extends IBundle {
  status: BundleStatus;
  bundleInfo: BundleInfo;
  downloadProgress: number;
  transferred: number;
}

export default () => {
  const { state, dispatch } = useContext(CreatorContext);

  const [currentFilter, setCurrentFilter] = useState(BundleFilterType.Engines);
  const [bundleList, setBundleList] = useState<BundleItem[]>([]);
  const [isBundleListLoading, setIsBundleListLoading] = useState(false);
  const [currentSelectedTabs, setCurrentSelectedTabs] = useState(
    BundleFilterType.Engines
  );

  useMount(async () => {
    delayExecution(() => {
      fetchManifest();
    }, 1000);
  });

  // 拉取资源列表
  const fetchManifest = async () => {
    try {
      setIsBundleListLoading(true);
      setBundleList([]);

      const localBundles = await BundlesManager.loadLocalBundles();
      const manifest = await BundlesManager.fetchManifest();

      const list: BundleItem[] = [];
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
    } catch (error) {
      GUIToaster.show({
        message: "加载资源列表错误：" + error.toString(),
        intent: Intent.DANGER,
        timeout: 3000
      });
    } finally {
      setIsBundleListLoading(false);
    }
  };

  const renderDesktopShell = () => {
    return <BundleDesktopPage></BundleDesktopPage>;
  };

  const renderList = (type: BundleType) => {
    bundleList.filter((v) => v.type === type);

    const sorted = bundleList
      .filter((v) => v.type === type)
      .sort((a, b) => {
        // 设为默认的优先
        // if (b.hash === defaultEngineBundleHash) {
        //   return 1;
        // }

        if (a.bundleInfo && b.bundleInfo) {
          if (semver.lt(a.bundleInfo.version, b.bundleInfo.version)) {
            return 1;
          }
        } else {
          return a.time - b.time;
        }

        return -1;
      });

    return (
      <List
        className="bundle-list"
        itemLayout="horizontal"
        style={{ height: "100%" }}
        loading={isBundleListLoading}
        dataSource={sorted}
        renderItem={(item) => (
          <BundleListItem key={item.hash} item={item}></BundleListItem>
        )}
      />
    );
  };

  const handleTabsChanged = (id: BundleFilterType) => {
    setCurrentSelectedTabs(id);
  };

  return (
    <>
      <div className="tabs-container">
        <Tabs
          className={"main-tabs"}
          large={true}
          selectedTabId={currentSelectedTabs}
          onChange={handleTabsChanged}
        >
          <Tab
            id={BundleFilterType.Engines}
            title="引擎"
            panel={renderList(BundleType.Engine)}
            panelClassName="ember-panel"
          />
          <Tab
            id={BundleFilterType.Templates}
            title="模板项目"
            panel={renderList(BundleType.Template)}
          />
          <Tab
            id={BundleFilterType.DesktopShell}
            title="桌面启动器"
            panel={renderDesktopShell()}
          />

          <Tabs.Expander />
          <Button
            minimal={true}
            large={false}
            icon="refresh"
            loading={isBundleListLoading}
            onClick={() => fetchManifest()}
          ></Button>
        </Tabs>
      </div>

      <div className={"footer"}></div>
    </>
  );
};
