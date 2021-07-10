import path from "path";
import Datastore from "nedb-promises";

import Env from "../env";

export class Database {
  datastore: Datastore;
  constructor(name: string) {
    // console.log("MainApplication.appDataDir", Env.getAppDataDir());

    const appDataDir = path.join(Env.getAppDataDir());
    this.datastore = Datastore.create({
      filename: path.join(appDataDir, "db", name),
      autoload: true,
      timestampData: true
    });

    console.log("Loaded datastore: ", this.datastore);
  }
}
