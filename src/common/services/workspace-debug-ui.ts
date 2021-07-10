import PubSub from "pubsub-js";
import { logger } from "../../renderer/common/lib/logger";
import { GlobalEvents } from "../global-events";

interface IDebugComponentData {
  text: string;
  callback: () => void;
}

export class WorkspaceDebugUI {
  static components: IDebugComponentData[] = [];
  static registerButton(text: string, callback: () => void, id?: string) {
    logger.debug("Register debug UI button: ", text);
    this.components.push({
      text,
      callback
    });

    PubSub.publishSync(GlobalEvents.DebugComponentsShouldRender);
  }
}
