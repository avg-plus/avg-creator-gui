import PubSub from "pubsub-js";
import { GlobalEvents } from "../../common/global-events";

interface IDebugComponentData {
  text: string;
  callback: () => void;
}

export class WorkspaceDebugUI {
  static components: IDebugComponentData[] = [];
  static registerButton(text: string, callback: () => void, id?: string) {
    this.components.push({
      text,
      callback
    });

    PubSub.publishSync(GlobalEvents.DebugComponentsShouldRender);
  }
}
