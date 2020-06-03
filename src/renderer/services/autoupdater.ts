import { remote } from "electron";
import { GUIToaster } from "./toaster";

const app = remote.app;
const autoUpdater = remote.autoUpdater;

const UpdateServer = "http://ws.avg-engine.com:5000";
const feed = `${UpdateServer}/update/${process.platform}/${app.getVersion()}`;

export class AutoUpdater {
  static init() {
    try {
      autoUpdater.setFeedURL({ url: feed });
    } catch (error) {
      console.log(error);
    }

    autoUpdater.on("checking-for-update", this.checkingForUpdate);
    autoUpdater.on("update-available", this.updateAvailable);
    autoUpdater.on("update-not-available", this.updateNotAvailable);
    autoUpdater.on("update-downloaded", this.updateDownloaded);

    autoUpdater.checkForUpdates();

    setInterval(() => {
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
    console.log("The autoUpdater has downloaded an update!");
    console.log(`The new release is named ${name} and was released on ${date}`);
    console.log(`The release notes are: ${notes}`);
    // The update will automatically be installed the next time the
    // app launches. If you want to, you can force the installation
    // now:
    autoUpdater.quitAndInstall();
  }

  static updateNotAvailable() {
    console.log("The autoUpdater has not found any updates :(");
  }

  static updateAvailable() {
    console.log("The autoUpdater has found an update!");
  }

  static checkingForUpdate() {
    console.log("The autoUpdater is checking for an update");
  }
}
export default new AutoUpdater();
