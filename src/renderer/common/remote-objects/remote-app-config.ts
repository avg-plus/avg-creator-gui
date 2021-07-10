import { remote } from "electron";
import nconf from "nconf";
const managerModule = __dirname + "/../src/main/remote/local-app-config";

export const LocalAppConfig: nconf.Provider =
  remote.require(managerModule).default;
