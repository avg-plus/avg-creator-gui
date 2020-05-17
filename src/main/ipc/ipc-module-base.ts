import { IPCEvents } from "../../../src/common/ipc-events";
import { ipcMain } from "electron-better-ipc";

export function IPC(eventName: IPCEvents) {
  return function (
    target: Object,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const method = propertyDescriptor.value;
    ipcMain.answerRenderer(eventName, method);

    return propertyDescriptor;
  };
}

export class IPCModule {
  static init() {}
}
