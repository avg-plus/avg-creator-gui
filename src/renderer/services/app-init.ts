import os from "os";
import { FocusStyleManager } from "@blueprintjs/core";

import "../../common/local-app-config";
import { AutoUpdater } from "./autoupdater";
import { logger } from "../../common/lib/logger";
import { remote } from "electron";
import { Env } from "../../common/env";

export class AppInit {
  static start() {
    logger.debug("App start: ", remote.app.getVersion(), os.platform());

    logger.debug("appDataDir", Env.getAppDataDir());

    // Blueprint 焦点设置
    FocusStyleManager.onlyShowFocusOnTabs();

    // 初始化自动更新
    AutoUpdater.init();
  }
}
