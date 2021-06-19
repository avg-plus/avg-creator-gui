import { BrowserWindow } from "electron";
import { WindowIDs } from "../common/window-ids";

const KEY = "window_ids";

type WindowRegistryInfo = {
  uniqueID: number;
  instanceID: string;
};

export class WindowsManager {
  remoteHello() {
    console.log("Remote: Hello World!");
  }

  async registerWindow(
    windowID: WindowIDs,
    uniqueID: number,
    instanceID: string
  ) {
    if (await this.getWindow(windowID)) {
      return;
    }

    if (!global[KEY]) {
      global[KEY] = {};
    }

    if (!global[KEY][windowID]) {
      global[KEY][windowID] = [];
    }

    const list = global[KEY][windowID] as WindowRegistryInfo[];

    const window = list.find((v) => {
      return (v.uniqueID = uniqueID);
    });

    if (window) {
      console.warn(`Unique ID ${uniqueID} in ${windowID} exists.`);
      return;
    }

    list.push({
      uniqueID,
      instanceID
    });

    global[KEY][windowID] = list;

    console.info("Register window => ", windowID, uniqueID);
  }

  async getWindow(windowID: WindowIDs, instanceID: string = "default") {
    const window_ids = global[KEY];
    if (!window_ids) {
      return;
    }

    if (!window_ids[windowID]) {
      return;
    }

    const list = window_ids[windowID] as WindowRegistryInfo[];
    const window = list.find((v) => {
      if (instanceID === "default") {
        return v;
      }

      return v.instanceID === instanceID;
    });

    if (window) {
      return BrowserWindow.fromId(window.uniqueID);
    }

    return;
  }
}

export default new WindowsManager();
