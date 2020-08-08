import nconf from "nconf";
import path from "path";
import { remote } from "electron";

const app = remote.app;

const appDataDir = path.join(app.getPath("appData"), app.getName());

export const LocalAppConfig = nconf
  .env()
  .argv()
  .file("config", {
    file: `${appDataDir}/config.json`
  });
