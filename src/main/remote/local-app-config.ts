import nconf from "nconf";
import path from "path";
import { app } from "electron";

const appDataDir = path.join(app.getPath("appData"), app.getName());

export const RemoteLocalAppConfig = nconf
  .env()
  .argv()
  .file("config", {
    file: `${appDataDir}/config.json`
  });
