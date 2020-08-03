import os from "os";
import { remote } from "electron";
import { GUIToaster } from "./toaster";
import { logger } from "../../common/lib/logger";

const app = remote.app;
const autoUpdater = remote.autoUpdater;

const UpdateServer = "http://ws.avg-engine.com:5000";
const feed = `${UpdateServer}/update/${process.platform}/${app.getVersion()}`;
var platform = os.platform() + "_" + os.arch(); // usually returns darwin_64
var version = app.getVersion();

const feedURL = `${UpdateServer}/update/` + platform + "/" + version;

export class AutoUpdater {
  static init() {
    try {
      logger.info("Init autoUpdater feed url: ", feedURL);
      // autoUpdater.setFeedURL({ url: feed });
      autoUpdater.setFeedURL({
        url: feedURL
      });
    } catch (error) {
      logger.error(error);
    }

    autoUpdater.checkForUpdates();

    autoUpdater.on("checking-for-update", this.checkingForUpdate);
    autoUpdater.on("update-available", this.updateAvailable);
    autoUpdater.on("update-not-available", this.updateNotAvailable);
    autoUpdater.on("update-downloaded", this.updateDownloaded);

    setInterval(() => {
      logger.info("checking for updates ...");
      autoUpdater.checkForUpdates();
    }, 5000);
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
    autoUpdater.quitAndInstall();
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
