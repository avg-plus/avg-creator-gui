import { logger } from "../lib/logger";
import { ProjectFileData } from "../manager/project-manager.ts";
import { BundlesManager } from "./bundles-manager/bundles-manager";

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
