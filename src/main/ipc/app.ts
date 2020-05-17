import { app } from "electron";
import { IPCModule, IPC } from "./ipc-module-base";
import { IPCEvents } from "../../common/ipc-events";

export class IPCElectronApp extends IPCModule {
  @IPC(IPCEvents.IPC_GetPath)
  static async getPath(
    name:
      | "home"
      | "appData"
      | "userData"
      | "cache"
      | "temp"
      | "exe"
      | "module"
      | "desktop"
      | "documents"
      | "downloads"
      | "music"
      | "pictures"
      | "videos"
      | "logs"
      | "pepperFlashSystemPlugin"
  ) {
    return app.getPath(name);
  }
}
