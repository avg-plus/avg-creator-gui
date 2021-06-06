import fs from "fs-extra";
import { DBProjects } from "../../../common/database/db-project";
import ProjectManager from "../../../common/services/project-manager";

export type ProjectBrowserItemType = "recently-project" | "templates";

export type DBProjectData = {};

export type ProjectBrowserItem = {
  id: string;
  itemType: ProjectBrowserItemType;
  path: string;
  name: string;
  engineHash: string;
  description?: string;
};

export class ProjectBrowserGUI {
  static async LoadProjectList(): Promise<ProjectBrowserItem[]> {
    const projects = await DBProjects.find({}).sort({ updatedAt: 1 });

    const list: ProjectBrowserItem[] = [];

    projects.forEach((v) => {
      const path = v["path"];

      if (fs.existsSync(path)) {
        // 尝试读取项目文件
        const data = ProjectManager.readProjectData(path);

        list.push({
          id: v._id,
          itemType: "recently-project",
          path,
          name: data.project_name
        } as ProjectBrowserItem);
      }
    });

    return list;
  }

  static openProject() {
    // pass project path to main window
  }
}
