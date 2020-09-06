import fs from "fs-extra";
import url from "url";
import path from "path";
import { remote } from "electron";
import { logger } from "../../common/lib/logger";
import { apiGetUpdate } from "./APIs/software-update-api";
import SemVer from "semver";
import { Env } from "../../common/env";
import got, { Progress, CancelableRequest } from "got";
import { Response } from "got/dist/source/core";
import { LocalAppConfig } from "../../common/local-app-config";

export interface UpdateItem {
  url: string;
  hash: string;
  time: string;
  version: string;
  forceUpdate?: boolean;
  descriptions?: string[];
}

export interface LocalPendingUpdateItem extends UpdateItem {
  filename: string;
}

interface UpdatesData {
  "win32-x64"?: UpdateItem[];
  "darwin-x64"?: UpdateItem[];
}

export class AutoUpdater {
  static init() {
    try {
    } catch (error) {
      logger.error(error);
    }
  }

  // 是否应该显示更新日志
  static isAppUpdated() {
    // 1. 检查配置里待定记录的版本，如果不是当前版本号，则认为是更新版本后的第一次启动
    // 2. 启动后默认把记录的版本号更新为当前版本号
    const updateVersion = LocalAppConfig.get("updateVersion") as string;
    const currentVersion = remote.app.getVersion();

    if (!updateVersion) {
      LocalAppConfig.set("updateVersion", currentVersion);
      LocalAppConfig.save();
      return false;
    }

    logger.debug("isAppUpdated", updateVersion);

    // 待定的版本为空，或者待定版本和当前启动的版本不一致
    if (updateVersion && updateVersion !== currentVersion) {
      // 设置更新版本为当前版本
      LocalAppConfig.set("updateVersion", currentVersion);

      // 删除待定更新记录
      LocalAppConfig.clear("pendingUpdates");
      LocalAppConfig.save();

      return true;
    }

    return false;
  }

  // 是否有本地
  static getLocalPendingUpdates() {
    const pendingUpdates = LocalAppConfig.get(
      "pendingUpdates"
    ) as LocalPendingUpdateItem;

    if (!pendingUpdates) {
      return null;
    }

    if (!pendingUpdates.filename || !fs.existsSync(pendingUpdates.filename)) {
      return null;
    }

    return pendingUpdates;
  }

  static async checkingForUpdates() {
    const currentVersion = remote.app.getVersion();
    const currentPlatform = `${remote.process.platform}-${remote.process.arch}`;
    logger.debug(
      "The autoUpdater is checking for an update... current version = ",
      currentVersion,
      currentPlatform
    );

    // 拉取更新信息
    const updateInfo = await apiGetUpdate<UpdatesData>();
    logger.debug("Fetch update infos: ", updateInfo);

    if (!updateInfo) {
      return null;
    }

    let updateItems = updateInfo[currentPlatform] as UpdateItem[];

    updateItems = updateItems.sort((a, b) => {
      return SemVer.compareBuild(b.version, a.version);
    });

    if (!updateItems || !updateItems.length) {
      return null;
    }

    const firstVersion = updateItems[0];

    logger.debug("sortedItems infos: ", updateItems);
    if (SemVer.compare(firstVersion.version, currentVersion)) {
      return firstVersion;
    }

    return null;
  }

  static download(
    item: UpdateItem,
    onProgressChanged: (
      item: UpdateItem,
      progress: Progress,
      request: CancelableRequest<Response<Buffer>>
    ) => void,
    onFinished: (filename: string) => void
  ): CancelableRequest<Response<Buffer>> {
    const downloadURL = item.url;

    logger.debug("Downloading updates: ", downloadURL);

    const request = got(downloadURL, {
      cache: false,
      responseType: "buffer",

      rejectUnauthorized: false
    });

    request
      .on("downloadProgress", (progress) => {
        onProgressChanged && onProgressChanged(item, progress, request);
      })
      .then((buffer) => {
        const parsed = url.parse(downloadURL);
        const saveDirectory = Env.getUpdatesDir();

        fs.mkdirpSync(saveDirectory);

        if (parsed.pathname) {
          const filename = path.join(
            saveDirectory,
            path.basename(parsed.pathname)
          );

          if (fs.existsSync(filename)) {
            fs.removeSync(filename);
          }

          fs.writeFileSync(filename, buffer.rawBody);

          logger.debug("downloaded: ", filename);
          onFinished && onFinished(filename);
        }
      });

    return request;
  }

  static updateDownloaded(
    event: Event,
    notes: string,
    name: string,
    date: Date,
    updateURL: string
  ) {
    logger.debug("The autoUpdater has downloaded an update!");
    logger.debug(
      `The new release is named ${name} and was released on ${date}`
    );
    logger.debug(`The release notes are: ${notes}`);
    // The update will automatically be installed the next time the
    // app launches. If you want to, you can force the installation
    // now:
    // autoUpdater.quitAndInstall();
  }

  static updateNotAvailable() {
    logger.debug("The autoUpdater has not found any updates :(");
  }

  static updateAvailable() {
    logger.debug("The autoUpdater has found an update!");
  }
}
export default new AutoUpdater();
