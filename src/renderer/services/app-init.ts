import { FocusStyleManager } from "@blueprintjs/core";

import { BundlesManager } from "./bundles-manager/bundles-manager";
import { Env } from "../../common/env";
import "../../common/local-app-config";

export class AppInit {
  static start() {
    FocusStyleManager.onlyShowFocusOnTabs();

    // 初始化环境
    Env.init();

    // 初始化自动更新
    // AutoUpdater.init();
  }
}
