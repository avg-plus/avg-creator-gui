import path from "path";
import { Env } from "../env";
// import Nedb from 'nedb';
import Datastore from "nedb-promises";

export class Database {
  datastore: Datastore;
  constructor(name: string) {
    this.datastore = Datastore.create({
      filename: path.join(
        "/Users/angrypowman/Library/Application Support/avg.creator",
        "db",
        name
      ),
      autoload: true
    });
  }
}
