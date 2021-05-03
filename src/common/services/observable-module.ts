import Rx, { PartialObserver, Subject } from "rxjs";
import { GlobalEvents } from "../global-events";

interface SubscribeEvent {
  type: GlobalEvents;
  data: any;
}

export class ObservableContext {
  protected static _subject = new Subject<SubscribeEvent>();

  // 订阅指定事件类型
  static subscribe<T>(
    types: GlobalEvents | Array<GlobalEvents>,
    next: (value: T) => void
  ) {
    ObservableContext._subject.subscribe((event: SubscribeEvent) => {
      if (
        (Array.isArray(types) && types.includes(event.type)) ||
        event.type === types
      ) {
        next(event.data as T);
      }
    });
  }

  static next<T>(type: GlobalEvents, value: T) {
    ObservableContext._subject.next({
      type,
      data: value
    });
  }
}
