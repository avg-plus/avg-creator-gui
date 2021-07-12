import { Database } from "./database";

class _DBResourceType extends Database {
  constructor() {
    super("resource-type");
  }
}

const db = new _DBResourceType();
const RemoteDBResources: Datastore & _DBResourceType = Object.assign(
  db.datastore,
  db
);

export type TDBResourceType = Datastore & _DBResourceType;
export default RemoteDBResources;
