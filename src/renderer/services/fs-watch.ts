import chokidar from "chokidar";
import { DebugServer } from "../../main/debug-server/debug-server";
import { DebugCommands } from "../../main/debug-server/commands";
import { logger } from "../../common/lib/logger";

export class AVGScriptHotReload {
  static watch(dir: string) {
    var watcher = chokidar.watch(dir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    watcher
      .on("add", (path) => {
        logger.info("File", path, "has been added");
      })
      .on("change", async (path) => {
        logger.info("File", path, "has been changed");

        DebugServer.sendDebugMessage({
          cmd: DebugCommands.Reload
        });
      })
      .on("unlink", (path) => {
        logger.info("File", path, "has been removed");
      })
      .on("error", (error) => {
        console.error("Error happened", error);
      });
  }
}
