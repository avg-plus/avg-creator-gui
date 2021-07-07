import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { GlobalEvents } from "../global-events";
import { IPCObservableCalls } from "./types";

class IPCObservableMain {
  constructor() {
    ipcMain.on(
      IPCObservableCalls.BroadcastRequest,
      (event: IpcMainEvent, args: any) => {
        console.log("Received broadcast request: ", event, args);

        this.broadcast(args.event, args.data);
      }
    );
  }

  broadcast<T>(event: GlobalEvents, data: T) {
    // Broadcast event to all renderers
    for (const browserWindow of BrowserWindow.getAllWindows()) {
      if (browserWindow.webContents) {
        browserWindow.webContents.send(
          IPCObservableCalls.ReceiveBroadcastEvents,
          {
            event,
            data
          }
        );
      }
    }
  }
}

export default new IPCObservableMain();
