import fs from "fs-extra";
import { app } from "electron";
import Env from "./remote/env";

export class MainApplication {
  static init() {
    app.setAppLogsPath();

    const appDataDir = Env.getAppDataDir();
    fs.ensureDirSync(appDataDir);
  }
}
