import { logger } from "../../../../common/lib/logger";
import { CEBlockService } from "./plugins/ce-block-service";

export class EditorBlockManager {
  private static blockServices: Map<string, CEBlockService> = new Map<
    string,
    CEBlockService
  >();

  static get(id: string) {
    return this.blockServices.get(id);
  }

  static registerBlock(id: string, service: CEBlockService) {
    this.blockServices.set(id, service);
    logger.verbose("Register block", id);
  }

  static unregisterBlock(id: string) {
    this.blockServices.delete(id);
    logger.verbose("UnRegister block", id);
  }

  static clear() {
    this.blockServices.clear();
  }
}
