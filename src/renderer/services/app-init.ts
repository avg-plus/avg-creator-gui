import { FocusStyleManager } from "@blueprintjs/core";

import "../../common/local-app-config";
import { AutoUpdater } from "./autoupdater";

export class AppInit {
  static start() {
    FocusStyleManager.onlyShowFocusOnTabs();

    // 初始化自动更新
    AutoUpdater.init();
  }
}
