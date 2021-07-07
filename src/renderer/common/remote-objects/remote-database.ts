import { remote } from "electron";
import { TDBProjects } from "../../../main/remote/database/db-project";

export const DBProjects: TDBProjects = remote.require(
  __dirname + "/../src/main/remote/database/db-project"
).default;
