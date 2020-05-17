import config from "nconf";
import path from "path";
import { remote } from "electron";

const app = remote.app;

const appDataDir = path.join(app.getPath("appData"), app.getName());
console.log("Init config from AppData dir : ", appDataDir);

export const nconf = config
  .env()
  .argv()
  .file("config", {
    file: `${appDataDir}/config.json`
  });
