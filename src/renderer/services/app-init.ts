import os from "os";
import { FocusStyleManager } from "@blueprintjs/core";

import "../../common/local-app-config";
import { logger } from "../../common/lib/logger";
import { remote } from "electron";
import { Env } from "../../common/env";
import "./version-compatibility";

export class AppInit {
  static start() {
    logger.debug("App start: ", remote.app.getVersion(), os.platform());
    logger.debug("appDataDir", Env.getAppDataDir());

    // Blueprint 焦点设置
    FocusStyleManager.onlyShowFocusOnTabs();
  }
}
