import path from "path";
import Datastore from "nedb-promises";

import { logger } from "../../../common/lib/logger";
import { app } from "electron";

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
