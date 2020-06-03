import { Env } from "../../common/env";
import "../../common/config";

export class AppInit {
  static start() {
    // 初始化环境
    Env.init();

    // 初始化自动更新
    // AutoUpdater.init();
  }
}
