import { dialog } from "electron";
import { IPCModule, IPC } from "../../common/ipc-module-base";
import { IPCMainEvents } from "../../common/ipc-events";

export class IPCDialog extends IPCModule {
  @IPC(IPCMainEvents.ShowOpenDialog)
  static async showOpenFolderDialog(data: { title: string }) {
    const filePaths = dialog.showOpenDialogSync({
      title: data.title ?? "选择目录",
      properties: ["openDirectory"]
    });

    return filePaths;
  }
}
