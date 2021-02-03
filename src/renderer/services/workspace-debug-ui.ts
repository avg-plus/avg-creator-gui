import PubSub from "pubsub-js";
import { GlobalEvents } from "../../common/global-events";
import { logger } from "../../common/lib/logger";

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
