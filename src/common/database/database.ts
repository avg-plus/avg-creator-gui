import path from "path";
import { Env } from "../env";
import Datastore from "nedb-promises";

import { remote } from "electron";
import { logger } from "../lib/logger";

const app = remote.app;

export class Database {
  datastore: Datastore;
  constructor(name: string) {
    const appDataDir = path.join(app.getPath("appData"), app.getName());
    this.datastore = Datastore.create({
      filename: path.join(appDataDir, "db", name),
      autoload: true,
      timestampData: true
    });

    logger.debug("Loaded datastore: ", this.datastore);
  }
}
