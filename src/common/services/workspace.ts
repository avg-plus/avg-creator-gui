import { logger } from "../lib/logger";
import { AVGProjectData } from "../manager/project-manager.v2.ts";
import { BundlesManager } from "./bundles-manager/bundles-manager";

export class Workspace {
  private static project: AVGProjectData;

  static getCurrentProject() {
    return this.project;
  }

  static async loadProject(project: AVGProjectData) {
    logger.info("Loading project: ", project);
    Workspace.project = project;

    // 载入本地安装包
    await BundlesManager.loadLocalBundles();
  }
}
