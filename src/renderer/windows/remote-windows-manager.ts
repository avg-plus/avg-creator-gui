import { remote } from "electron";
import { WindowsManager } from "../../main/window-manager";

const managerModule = __dirname + "/../src/main/window-manager";

export const windowManager: WindowsManager =
  remote.require(managerModule).default;
