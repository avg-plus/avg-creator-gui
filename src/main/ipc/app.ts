import { app } from "electron";
import { IPCMainEvents } from "./../../common/ipc-events";
import { IPCModule, IPC } from "../../common/ipc-module-base";

export class IPCElectronApp extends IPCModule {
  @IPC(IPCMainEvents.GetPath)
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
