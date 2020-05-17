import { dialog } from "electron";
import { IPCModule, IPC } from "./ipc-module-base";
import { IPCEvents } from "../../../src/common/ipc-events";
// import { ipcRenderer } from 'electron-better-ipc';
// import { ipcMain } from 'electron-better-ipc';

export class IPCDialog extends IPCModule {
  @IPC(IPCEvents.IPC_ShowOpenDialog)
  static async showOpenFolderDialog(data: { title: string }) {
    const filePaths = dialog.showOpenDialogSync({
      title: data.title ?? "选择目录",
      properties: ["openDirectory"]
    });

    return filePaths;
  }
}
