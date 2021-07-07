import React, { useContext, useState, useEffect } from "react";
import { remote } from "electron";
import { Alert, Intent, Tag, ProgressBar } from "@blueprintjs/core";
import { CreatorContext } from "../../hooks/context";
import SemVer from "semver";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { logger } from "../../../common/lib/logger";
import {
  UpdateItem,
  AutoUpdater,
  LocalPendingUpdateItem
} from "../../../common/services/autoupdater";

import "./update-alert.less";

import _ from "underscore";
import { Progress, CancelableRequest } from "got";
import { formatBytes } from "../../../common/utils";
import { spawnSync } from "child_process";
import { Response, RequestError } from "got/dist/source/core";
import { LocalAppConfig } from "../../../common/remote-objects/remote-app-config";
import { Env } from "../../../common/env";

export default () => {
  const { state, dispatch } = useContext(CreatorContext);
  const [downloadingStatus, setDownloadingStatus] = useState<Progress>();
  const [downloadedFile, setDownloadedFile] = useState<string>("");
  const [currentDownloadRequest, setCurrentDownloadRequest] =
    useState<CancelableRequest<Response<Buffer>>>();

  let shouldUpdate = false;
  let imcommingVersion = "";
  let currentVersion = "";
  const updateItem = state.checkUpdateAlert.updateItem;
  const status = state.checkUpdateAlert.status;

  if (updateItem) {
    imcommingVersion = updateItem.version;
    currentVersion = remote.app.getVersion();
    if (imcommingVersion && currentVersion) {
      if (SemVer.compare(imcommingVersion, currentVersion)) {
        shouldUpdate = true;
      }
    }
  }

  const renderDescriptions = (descriptions: string[]) => {
    console.log("renderDescriptions", descriptions);

    return descriptions.map((v, index) => {
      return (
        <div>
          {index + 1}. {v}
        </div>
      );
    });
  };

  const renderCheckUpdateAlert = (updateItem: UpdateItem | null) => {
    if (!updateItem || !shouldUpdate) {
      return "已经是最新版本啦！";
    } else {
      return (
        <>
          <div>
            <h3>✨ 有新的可用版本！</h3>
          </div>
          <div>当前版本：v{currentVersion}</div>
          <div>
            最新版本：v{imcommingVersion}{" "}
            <Tag minimal={true} intent={"danger"}>
              NEW
            </Tag>
          </div>
          <div> 发布时间：{updateItem?.time}</div>
          {updateItem.descriptions && updateItem.descriptions.length && (
            <>
              <br />
              <h4>更新内容：</h4>
              {renderDescriptions(updateItem.descriptions || [])}
            </>
          )}
        </>
      );
    }
  };

  const renderDownload = (updateItem: UpdateItem) => {
    return (
      <>
        {status === "Downloading" && !downloadingStatus && (
          <div>正在连接服务器 ...</div>
        )}
        {downloadingStatus && status === "Downloading" && (
          <div>
            <ProgressBar
              stripes={false}
              value={downloadingStatus.percent ?? 1}
              intent={Intent.PRIMARY}
            ></ProgressBar>
            <div className={"downloading-tips"}>
              {status === "Downloading" && (
                <>
                  正在下载 {(downloadingStatus.percent * 100).toFixed(1)}%,{" "}
                  {formatBytes(downloadingStatus.transferred, 1)}/
                  {formatBytes(downloadingStatus.total ?? 0, 1)} ...
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const cancelDownload = () => {
    currentDownloadRequest?.cancel();
    dispatch({
      type: AVGCreatorActionType.CheckUpdateAlert,
      payload: {
        open: true,
        status: "Cancelled",
        updateItem: updateItem
      }
    });
    return;
  };

  const handleClose = () => {
    dispatch({
      type: AVGCreatorActionType.CheckUpdateAlert,
      payload: {
        open: false,
        status: "Alert",
        updateItem: null
      }
    });
  };

  useEffect(() => {
    setDownloadingStatus(downloadingStatus);
    return () => {};
  }, [downloadingStatus]);

  const handleDownload = async (updateItem: UpdateItem) => {
    if (status === "Downloading") {
      return;
    }

    dispatch({
      type: AVGCreatorActionType.CheckUpdateAlert,
      payload: {
        open: true,
        status: "Downloading",
        updateItem
      }
    });

    const onUpdateCallback = _.throttle(
      (
        item: UpdateItem,
        progress: Progress,
        request: CancelableRequest<Response<Buffer>>
      ) => {
        setDownloadingStatus(progress);
        setCurrentDownloadRequest(request);

        // 下载完成
        if (progress.percent >= 1 && !request.isCanceled) {
          dispatch({
            type: AVGCreatorActionType.CheckUpdateAlert,
            payload: {
              open: true,
              status: "DownloadFinished",
              updateItem
            }
          });
        }
      },
      50
    );

    AutoUpdater.download(updateItem, onUpdateCallback, (filename) => {
      setDownloadedFile(filename);

      // 缓存到本地配置文件里，下次检测更新时对比版本号和哈希一致，则不再下载
      LocalAppConfig.set("pendingUpdates", {
        filename,
        ...updateItem
      } as LocalPendingUpdateItem);

      LocalAppConfig.save();
    })
      .then(
        () => {},
        (reason: RequestError) => {
          logger.error("Download error: ", reason.message);

          if (reason.message.includes("Promise was canceled")) {
            dispatch({
              type: AVGCreatorActionType.CheckUpdateAlert,
              payload: {
                open: true,
                status: "Cancelled",
                updateItem
              }
            });
            return;
          }

          dispatch({
            type: AVGCreatorActionType.CheckUpdateAlert,
            payload: {
              open: true,
              status: "Error",
              updateItem
            }
          });
        }
      )
      .catch((reason: string) => {});
  };

  const quitAndInstall = async (filename: string) => {
    logger.debug("quitAndInstall", filename);

    // 打开安装程序
    if (Env.getOSName() === "MacOS") {
      spawnSync("open", [filename]);
    } else {
      spawnSync(filename, []);
    }

    // 删除待安装记录
    // LocalAppConfig.clear("pendingUpdates");

    // 退出程序
    if (Env.isProduction()) {
      remote.app.quit();
    }
  };

  const handleConfirm = async () => {
    const status = state.checkUpdateAlert.status;

    logger.debug("Current confirm status ", status, updateItem);

    switch (status) {
      case "Alert": {
        if (shouldUpdate && updateItem) {
          handleDownload(updateItem);
        } else {
          handleClose();
        }
        break;
      }
      case "Downloading": {
        cancelDownload();
        break;
      }
      case "DownloadFinished": {
        quitAndInstall(downloadedFile);

        break;
      }
      case "InstallLocalPending": {
        if (updateItem) {
          quitAndInstall((updateItem as LocalPendingUpdateItem).filename);
        }
        break;
      }
      case "Cancelled": {
        handleClose();
        break;
      }
      case "Error": {
        if (state.checkUpdateAlert.updateItem) {
          await handleDownload(state.checkUpdateAlert.updateItem);
        }
        break;
      }
    }
  };

  const renderButtonText = () => {
    const status = state.checkUpdateAlert.status;

    switch (status) {
      case "Alert": {
        return shouldUpdate
          ? { confirm: "开始下载更新", cancel: "下次一定" }
          : { confirm: "好的", cancel: "" };
      }
      case "Downloading": {
        return { confirm: "取消下载", cancel: "" };
      }
      case "DownloadFinished":
      case "InstallLocalPending": {
        return { confirm: "退出并更新", cancel: "下次一定" };
      }
      case "Cancelled": {
        return { confirm: "关闭", cancel: "" };
      }
      case "Error": {
        return { confirm: "重试", cancel: "关闭" };
      }
    }
  };

  return (
    <Alert
      isOpen={state.checkUpdateAlert.open}
      canEscapeKeyCancel={true}
      icon={"automatic-updates"}
      intent={Intent.PRIMARY}
      cancelButtonText={renderButtonText().cancel}
      confirmButtonText={renderButtonText().confirm}
      onCancel={handleClose}
      onConfirm={handleConfirm}
    >
      <div className="alert-dialog-container">
        {status === "Alert" && renderCheckUpdateAlert(updateItem)}
        {status === "Cancelled" && <div>本次更新已取消。</div>}
        {status === "Error" && <div>下载发生错误，请检查网络。</div>}
        {status === "DownloadFinished" && <div>下载完成，退出后自动更新。</div>}
        {status === "InstallLocalPending" && (
          <div>更新包已下载完成，可执行更新操作。</div>
        )}
        {status === "Downloading" && updateItem && renderDownload(updateItem)}
        {status === "DownloadFinished" &&
          updateItem &&
          renderDownload(updateItem)}
      </div>
    </Alert>
  );
};
