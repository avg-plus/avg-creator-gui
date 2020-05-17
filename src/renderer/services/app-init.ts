import { Env } from "../../common/env";
import "../../common/config";

export class AppInit {
  static start() {
    Env.init();
  }
}
