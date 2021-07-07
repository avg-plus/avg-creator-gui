import { remote } from "electron";
import { WindowsManager } from "../../../main/remote/window-manager";
const managerModule = __dirname + "/../src/main/remote/window-manager";

export const windowManager: WindowsManager =
  remote.require(managerModule).default;
