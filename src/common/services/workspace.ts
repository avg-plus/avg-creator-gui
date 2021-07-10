import { logger } from "../../renderer/common/lib/logger";
import { BundlesManager } from "./bundles-manager/bundles-manager";
import { ProjectFileData } from "./file-reader/project-file-reader";

export class Workspace {
  private static project: ProjectFileData;

  static getCurrentProject() {
    return this.project;
  }

  static async loadProject(project: ProjectFileData) {
    logger.info("Loading project: ", project);
    Workspace.project = project;

    // 载入本地安装包
    await BundlesManager.loadLocalBundles();
  }
}
