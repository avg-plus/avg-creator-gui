import nconf from "nconf";
import path from "path";
import { remote } from "electron";
import { logger } from "./lib/logger";

const app = remote.app;

const appDataDir = path.join(app.getPath("appData"), app.getName());
// logger.debug("Init config from AppData dir : ", appDataDir);

export const LocalAppConfig = nconf
  .env()
  .argv()
  .file("config", {
    file: `${appDataDir}/config.json`
  });
