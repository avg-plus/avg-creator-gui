import os from "os";
import { FocusStyleManager } from "@blueprintjs/core";

import "../../common/local-app-config";
import { AutoUpdater } from "./autoupdater";
import { logger } from "../../common/lib/logger";
import { remote } from "electron";

export class AppInit {
  static start() {
    logger.info("App start: ", remote.app.getVersion(), os.platform());

    // Blueprint 焦点设置
    FocusStyleManager.onlyShowFocusOnTabs();

    // 初始化自动更新
    AutoUpdater.init();
  }
}
