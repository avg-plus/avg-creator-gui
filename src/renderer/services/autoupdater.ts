import os from "os";
import { remote } from "electron";
import { GUIToaster } from "./toaster";
import { logger } from "../../common/lib/logger";
import updater from "electron-simple-updater";
import { apiGetUpdate } from "./APIs/software-update-api";

export class AutoUpdater {
  static init() {
    try {
    } catch (error) {
      logger.error(error);
    }
  }

  static async checkingForUpdate() {
    const currentVersion = remote.app.getVersion();
    const currentPlatform = `${remote.process.platform}-${remote.process.arch}`;
    logger.debug(
      "The autoUpdater is checking for an update... current version = ",
      currentVersion,
      currentPlatform
    );

    // 拉取更新信息
    const updateInfo = await apiGetUpdate();
    logger.debug("Fetch update infos: ", updateInfo);
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
