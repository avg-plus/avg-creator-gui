import { Database } from "./database";

class _DBProjects extends Database {
  public aaa: string;

  constructor() {
    super("projects");
  }
}

const db = new _DBProjects();
export const DBProjects = Object.assign({}, db, db.datastore);
