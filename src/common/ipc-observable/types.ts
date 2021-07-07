import { GlobalEvents } from "../global-events";
import { WindowIDs } from "../window-ids";

export enum IPCObservableCalls {
  Subscribe = "subscribe",
  BroadcastRequest = "BroadcastRequest",
  ReceiveBroadcastEvents = "ReceiveBroadcastEvents"
}

export type IPCBroadcastPacket = {
  event: GlobalEvents;
  data: any;
};

export interface ObserverItem {
  id: string;
  event: GlobalEvents;
  source?: WindowIDs;
  instanceID?: string;
  once?: boolean;
  value?: unknown;
  callback: (value: unknown, source?: WindowIDs) => void;
}
