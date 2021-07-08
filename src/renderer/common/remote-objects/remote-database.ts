import { remote } from "electron";
import { TDBProjects } from "../../../main/remote/database/db-project";
import { TDBResources } from "../../../main/remote/database/db-resource";
import { TDBResourceType } from "../../../main/remote/database/db-resourceType";

export const DBProjects: TDBProjects = remote.require(
  __dirname + "/../src/main/remote/database/db-project"
).default;

export const DBResource: TDBResources = remote.require(
  __dirname + "/../src/main/remote/database/db-resource"
).default;

export const DBResourceType: TDBResourceType = remote.require(
  __dirname + "/../src/main/remote/database/db-resourceType"
).default;
