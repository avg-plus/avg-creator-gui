import fs from "fs-extra";
import url from "url";
import path from "path";
import { remote } from "electron";
import { logger } from "../../common/lib/logger";
import { apiGetUpdate } from "./APIs/software-update-api";
import SemVer from "semver";
import got from "../../common/got-request";
import { Progress } from "got/dist/source";
import { Env } from "../../common/env";

export interface UpdateItemConfig {
  url: string;
  hash: string;
  time: string;
  version: string;
  forceUpdate?: boolean;
  descriptions?: string[];
}

interface UpdatesData {
  "win32-x64"?: UpdateItemConfig[];
  "darwin-x64"?: UpdateItemConfig[];
}

export class AutoUpdater {
  static init() {
    try {
    } catch (error) {
      logger.error(error);
    }
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

    let updateItems = updateInfo[currentPlatform] as UpdateItemConfig[];

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

  static async download(
    item: UpdateItemConfig,
    onProgressChanged: (item: UpdateItemConfig, progress: Progress) => void
  ) {
    const downloadURL = item.url;
    const response = await got(downloadURL, {
      cache: false,
      rejectUnauthorized: false
    }).on("downloadProgress", (progress) => {
      onProgressChanged && onProgressChanged(item, progress);
    });

    const parsed = url.parse(downloadURL);
    const saveDirectory = Env.getUpdatesDir();

    fs.mkdirpSync(saveDirectory);

    if (parsed.pathname) {
      fs.writeFileSync(
        path.join(saveDirectory, path.basename(parsed.pathname)),
        response.rawBody
      );
    }
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
