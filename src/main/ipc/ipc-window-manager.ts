import { ipcMain as ipc } from "electron-better-ipc";
import { IPCChannels } from "../../common/ipc-channels";
import { WindowIDs } from "../../renderer/common/window-ids";

const KEY = "window_ids";

export class IPCWindowManager {
  static init() {
    ipc.answerRenderer(IPCChannels.RegisterWindowID, this.ipcRegisterWindow);

    // ipc.answerRenderer(IPCChannels.GetWindowID, this.ipcGetWindow);

    // ipc.answerRenderer('get-emoji', async emojiName => {
    //     return "";
    // });
  }

  static async ipcRegisterWindow(data: {
    windowID: WindowIDs;
    uniqueID: number;
  }) {
    if (!global[KEY]) {
      global[KEY] = {};
    }

    const { windowID, uniqueID } = data;
    global[KEY][windowID] = uniqueID;
  }

  static async ipcGetWindow(data: { windowID: WindowIDs }) {
    console.log("get window id ", data);

    const { windowID } = data;
    console.log("global", global, global[KEY][windowID]);

    return global[KEY][windowID];
  }
}
