import { remote } from "electron";
import { TDBProjects } from "../../../main/remote/database/db-project";
const managerModule = __dirname + "/../src/main/remote/database/db-project";

export const DBProjects: TDBProjects = remote.require(managerModule).default;
