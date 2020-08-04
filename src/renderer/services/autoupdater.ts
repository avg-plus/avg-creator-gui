import os from "os";
import { remote } from "electron";
import { GUIToaster } from "./toaster";
import { logger } from "../../common/lib/logger";
import updater from "electron-simple-updater";

// const app = remote.app;
// const autoUpdater = remote.autoUpdater;

const UpdateServer = "http://ws.avg-engine.com:5000";
// const feed = `${UpdateServer}/update/${process.platform}/${app.getVersion()}`;

// const feedURL = `${UpdateServer}/update/` + platform + "/" + version;

export class AutoUpdater {
  static init() {
    try {
      // logger.info("Init autoUpdater feed url: ", feedURL);

      const s = updater.init({
        autoDownload: true,
        logger: logger,
        channel: "prod",
        version: remote.app.getVersion(),
        url: "https://api.avg-engine.com/creator-gui/check-update"
      });
    } catch (error) {
      logger.error(error);
    }

    // autoUpdater.checkForUpdates();

    // autoUpdater.on("checking-for-update", this.checkingForUpdate);
    // autoUpdater.on("update-available", this.updateAvailable);
    // autoUpdater.on("update-not-available", this.updateNotAvailable);
    // autoUpdater.on("update-downloaded", this.updateDownloaded);

    // setInterval(() => {
    //   logger.info("checking for updates ...");
    //   autoUpdater.checkForUpdates();
    // }, 5000);
  }

  static checkUpdate() {
    const currentVersion = remote.app.getVersion();
  }

  static updateDownloaded(
    event: Event,
    notes: string,
    name: string,
    date: Date,
    updateURL: string
  ) {
    logger.info("The autoUpdater has downloaded an update!");
    logger.info(`The new release is named ${name} and was released on ${date}`);
    logger.info(`The release notes are: ${notes}`);
    // The update will automatically be installed the next time the
    // app launches. If you want to, you can force the installation
    // now:
    // autoUpdater.quitAndInstall();
  }

  static updateNotAvailable() {
    logger.info("The autoUpdater has not found any updates :(");
  }

  static updateAvailable() {
    logger.info("The autoUpdater has found an update!");
  }

  static checkingForUpdate() {
    logger.info("The autoUpdater is checking for an update");
  }
}
export default new AutoUpdater();
