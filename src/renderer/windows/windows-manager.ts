import { BrowserWindow, remote } from "electron";
import { ipcRenderer as ipc } from "electron-better-ipc";
import { IPCChannels } from "../../common/ipc-channels";
import { WindowIDs } from "../common/window-ids";
// import { GUIProjectBrowserWindow } from "./project-browser-window";
// import { GUIWorkspaceWindow } from "./workspace-window";

export class WindowsManager {
  static registerWindow(windowID: WindowIDs, uniqueID: number) {
    // send message to main process
    ipc.callMain(IPCChannels.RegisterWindowID, {
      windowID,
      uniqueID
    });
  }

  static async getWindow(windowID: WindowIDs) {
    const window_ids = remote.getGlobal("window_ids");
    const uniqueID = window_ids[windowID];

    return remote.BrowserWindow.fromId(uniqueID as number);
  }

  //   static getWindow(id: WindowIDs) {
  //     const windowID = window["window_ids"][id] as number;
  //     const browserWindow = remote.BrowserWindow.fromId(windowID);
  //     if (!browserWindow) {
  //       return this.createWindowByID(id);
  //     }
  //   }

  //   static createWindowByID(id: WindowIDs) {
  //     const ids = {
  //       [WindowIDs.ProjectBrowserWindow]: GUIProjectBrowserWindow,
  //       [WindowIDs.WorkspaceWindow]: GUIWorkspaceWindow
  //     };

  //     return new ids[id]();
  //   }
}
