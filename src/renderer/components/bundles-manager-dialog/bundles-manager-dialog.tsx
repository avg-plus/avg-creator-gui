import React, { useState, useEffect } from "react";
import { Table, Progress as AntdProgress } from "antd";
import { Progress } from "got";
import glob from "glob";
import md5File from "md5-file";
import fs from "fs-extra";
import { Scrollbars } from "react-custom-scrollbars";

import {
  IBundle,
  BundlesManager,
  BundleType
} from "../../services/bundles-manager/bundles-manager";
import { formatBytes } from "../../../common/utils";
import { GUIToaster } from "../../../renderer/services/toaster";
import {
  Intent,
  ButtonGroup,
  Button,
  AnchorButton,
  Icon,
  ContextMenu
} from "@blueprintjs/core";
import { useMount } from "react-use";

import "./bundles-manager-dialog.less";
import { Env } from "../../../common/env";
import { BundleListItemContextMenu } from "../context-menus/bundle-list-menus";
// import { Env } from "common/env";
// import { Env } from "../../../common/env";

const columns = [
  {
    title: "版本",
    dataIndex: "hash",
    key: "hash"
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    width: 100,
    render: (type: BundleType) => {
      return type === BundleType.Engines ? "引擎" : "模板项目";
    }
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
    width: 100,
    render: (text: number) => {
      return formatBytes(text);
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 80,
    render: (status: BundleStatus) => {
      if (status === BundleStatus.Downloaded) {
        return <Icon icon="tick" color={"green"}></Icon>;
      } else if (status === BundleStatus.Downloading) {
        return (
          <AntdProgress
            percent={44}
            steps={5}
            size="small"
            strokeColor="#52c41a"
          />
        );
      }

      return <Icon icon="double-chevron-down"></Icon>;
    }
  }
];

enum BundleFilterType {
  All = "All",
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
  downloadProgress: number;
}

type BundleCached = Set<string>;
export const BundleManagerDialog = () => {
  const [currentFilter, setCurrentFilter] = useState(BundleFilterType.All);

  const [rawBundleList, setRawBundleList] = useState<BundleItem[]>([]);
  const [bundleList, setBundleList] = useState<BundleItem[]>([]);
  const [localBundles, setLocalBundles] = useState<BundleCached>();

  const [downloadingTips, setDownloadingTips] = useState(
    "当前没有任何更新任务"
  );

  const bundleUpdates = (
    current: {
      index: number;
      bundle: IBundle;
      progress: Progress;
    },
    list: IBundle[]
  ) => {
    const key = "bundle-updates";
    const transferred = formatBytes(current.progress.transferred, 1);
    const total = formatBytes(current.progress.total ?? 0, 1);
    setDownloadingTips(`正在下载 ${transferred}/${total}`);

    if (current.index + 1 === list.length && current.progress.percent >= 1) {
      GUIToaster.show(
        {
          message: "AVGPlus 数据已更新",
          icon: "updated",
          timeout: 5000,
          intent: Intent.SUCCESS
        },
        key
      );

      setDownloadingTips(`数据已更新`);
    }
  };

  useMount(async () => {
    await listLocalBundles();
    await fetchManifest();
  });

  useEffect(() => {
    for (const bundle of bundleList) {
      if (localBundles?.has(bundle.hash)) {
        bundle.status = BundleStatus.Downloaded;
      }
    }
  }, [bundleList]);

  const listLocalBundles = async () => {
    const bundleDir = Env.getBundleDir();
    const files = glob.sync(`${bundleDir}/**/*.zip`, { nodir: true });

    const bundles = new Set<string>();
    for (const file of files) {
      bundles.add(await md5File(file));
    }

    setLocalBundles(bundles);
  };

  const fetchManifest = async () => {
    const manifest = await BundlesManager.fetchManifest();

    const list = [];
    for (const bundle of manifest.bundles) {
      const bundleItem = bundle as BundleItem;
      bundleItem.status = BundleStatus.NotDownload;

      list.push(bundleItem);
    }

    setRawBundleList(list);
    setBundleList(list);
  };

  const handleFilterChanged = (filter: BundleFilterType) => {
    const list = rawBundleList.filter((v) => {
      if (filter === BundleFilterType.Engines) {
        return v.type === BundleType.Engines;
      } else if (filter === BundleFilterType.Templates) {
        return v.type === BundleType.Templtes;
      }

      return true;
    });

    setBundleList(list);
    setCurrentFilter(filter);
  };

  const handleBundleDownload = (bundle: BundleItem) => {};

  return (
    <>
      <div className="button-group-toolbar">
        <ButtonGroup fill={true} minimal={false}>
          <Button
            active={currentFilter === BundleFilterType.All}
            icon="archive"
            onClick={() => handleFilterChanged(BundleFilterType.All)}
          >
            全部
          </Button>
          <Button
            active={currentFilter === BundleFilterType.Templates}
            icon="projects"
            onClick={() => handleFilterChanged(BundleFilterType.Templates)}
          >
            模板项目
          </Button>
          <Button
            active={currentFilter === BundleFilterType.Engines}
            icon="application"
            onClick={() => handleFilterChanged(BundleFilterType.Engines)}
          >
            引擎
          </Button>
        </ButtonGroup>{" "}
      </div>

      <Table
        className="bundle-table-list"
        pagination={false}
        onRow={(record) => {
          return {
            onContextMenu: (event) => {
              ContextMenu.show(
                <BundleListItemContextMenu
                  bundle={record}
                  onDownload={handleBundleDownload}
                  onDelete={() => {}}
                />,
                {
                  left: event.clientX,
                  top: event.clientY
                }
              );
            }
          };
        }}
        columns={columns}
        dataSource={bundleList}
        size="small"
        bordered={false}
        scroll={{ y: "79%" }}
      />
    </>
  );
};
