import { Database } from "./database";

class _DBProjects extends Database {
  constructor() {
    super("projects");
  }
}

const db = new _DBProjects();
const RemoteDBProjects: Datastore & _DBProjects = Object.assign(
  db.datastore,
  db
);

export type TDBProjects = Datastore & _DBProjects;
export default RemoteDBProjects;
