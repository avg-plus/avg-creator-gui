import { Database } from "./database";

class _DBResources extends Database {
  constructor() {
    super("resource");
  }
}

const db = new _DBResources();
const RemoteDBResources: Datastore & _DBResources = Object.assign(
  db.datastore,
  db
);

export type TDBResources = Datastore & _DBResources;
export default RemoteDBResources;
