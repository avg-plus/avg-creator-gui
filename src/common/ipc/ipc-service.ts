import { ipcMain as ipc } from 'electron-better-ipc';


export function IPC(eventName: string) {

  return function (target: Object, propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDescriptor.value;
    ipc.answerRenderer(eventName, method);

    return propertyDescriptor;
  }
};

export class IPCService {
  init() {
    // ipc.answerRenderer('get-emoji', async emojiName => {
    //   const emoji = await getEmoji(emojiName);
    //   return emoji;
    // });
  }

}