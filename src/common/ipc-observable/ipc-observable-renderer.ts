import { ipcRenderer, remote } from "electron";
import { v4 as uuidv4 } from "uuid";
import { GlobalEvents } from "../global-events";
import { WindowIDs } from "../window-ids";
import { IPCBroadcastPacket, IPCObservableCalls, ObserverItem } from "./types";

class IPCObservableRenderer {
  private subscribeRegistries = new Map<GlobalEvents, Array<ObserverItem>>();

  constructor() {
    // Every renderer should subscribe broadcast event from main process
    ipcRenderer.on(
      IPCObservableCalls.ReceiveBroadcastEvents,
      (event, args: IPCBroadcastPacket) => {
        console.log("Received broadcast event from main process: ", args);

        // Find all observer items and callback
        let items = this.subscribeRegistries.get(args.event);
        if (!items || !items.length) {
          return;
        }

        const shouldDeleteItemIDs: string[] = [];
        for (let i = 0; i < items.length; i++) {
          const observerItem = items[i];
          observerItem.callback && observerItem.callback(args.data);

          if (observerItem.once) {
            shouldDeleteItemIDs.push(observerItem.id);
          }
        }

        shouldDeleteItemIDs.map((id) => {
          if (items && items.length) {
            items = items.filter((v) => {
              return v.id !== id;
            });
          }
        });

        this.subscribeRegistries.set(args.event, items);
      }
    );
  }

  subscribe<T>(
    event: GlobalEvents,
    callback: (value: T, source?: WindowIDs) => void,
    source?: WindowIDs,
    instanceID?: string
  ) {
    return this._subscribe<T>(event, callback, true, source, instanceID);
  }

  subscribeOnce<T>(
    event: GlobalEvents,
    callback: (value: T, source: WindowIDs) => void,
    source?: WindowIDs,
    instanceID?: string
  ) {
    return this._subscribe<T>(event, callback, true, source, instanceID);
  }

  unsubscribe(itemOrID: ObserverItem | string) {
    ipcRenderer.send(IPCObservableCalls.Subscribe, { itemOrID });
  }

  broadcast<T>(event: GlobalEvents, data?: T) {
    console.log("IPCObservableRenderer: broadcast request", event, data);

    ipcRenderer.send(IPCObservableCalls.BroadcastRequest, {
      event,
      data
    });
  }

  private async _subscribe<T>(
    event: GlobalEvents,
    callback: (value: T, source?: WindowIDs) => void,
    once?: boolean,
    source?: WindowIDs,
    instanceID?: string
  ) {
    const item = {
      id: uuidv4(),
      event,
      source,
      instanceID,
      once: false,
      callback
    } as ObserverItem;

    let observerItems = this.subscribeRegistries.get(event);
    if (observerItems) {
      // 查找是否具有相同的 callback
      const exists = observerItems.find((v) => {
        return v.callback === callback;
      });

      if (!exists) {
        observerItems.push(item);
      }
    } else {
      observerItems = [item];
    }

    this.subscribeRegistries.set(event, observerItems);
  }
}

export default new IPCObservableRenderer();
