import { logger } from "../../common/lib/logger";
import { AVGProject } from "./project";

export class WorkspaceContext {
  private static project: AVGProject;

  static getCurrentProject() {
    return this.project;
  }

  static async loadProject(projectDir: string) {
    logger.info("Loading project: ", projectDir);

    // 构造项目
    const project = new AVGProject();
    project.loadProject(projectDir);

    WorkspaceContext.project = project;

    return project;
  }
}
