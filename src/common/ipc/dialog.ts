import { IPCService, IPC } from './ipc-service';
import { dialog } from 'electron';
// import { ipcRenderer } from 'electron-better-ipc';
// import { ipcMain } from 'electron-better-ipc';

export class IPCDialog {

  @IPC("IPC_ShowOpenDialog")
  static async showOpenFolderDialog() {
    // const filePaths = await dialog.showOpenDialogSync({
    //   title: 'Open Fiddle',
    //   properties: ['openDirectory']
    // });

    // if (!filePaths || filePaths.length < 1) {
    //   return;
    // }
  }
}