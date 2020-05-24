import { Database } from "./database";

class _DBProjects extends Database {
  constructor() {
    super("projects");
  }

  aaa: string;
}

const db = new _DBProjects();
export const DBProjects: Datastore & _DBProjects = Object.assign(
  db.datastore,
  db
);
