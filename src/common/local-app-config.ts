import nconf from "nconf";
import path from "path";
import { remote, app as ElectronApp } from "electron";

let app: Electron.App = ElectronApp;
if (process.type === "renderer") {
  app = remote.app;
}

const appDataDir = path.join(app.getPath("appData"), app.getName());

export const LocalAppConfig = nconf
  .env()
  .argv()
  .file("config", {
    file: `${appDataDir}/config.json`
  });
