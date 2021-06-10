import { BrowserWindow, remote } from "electron";
import fs from "fs-extra";

import { DBProjects } from "../../../common/database/db-project";
import ProjectManager from "../../../common/services/project-manager";
import { ProjectBrowserWindow } from "../../windows/project-browser-window";
import { WorkspaceWindow } from "../../windows/workspace-window";

export type ProjectBrowserItemType = "recently-project" | "templates";
export type ProjectBrowserItem = {
  id: string;
  itemType: ProjectBrowserItemType;
  path: string;
  name: string;
  engineHash: string;
  description?: string;
};

export class ProjectBrowserGUI {
  // pass project path to main window

  static async loadProjectList(): Promise<ProjectBrowserItem[]> {
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
          path: path,
          description: data.description,
          name: data.project_name
        } as ProjectBrowserItem);
      }
    });

    return list;
  }

  static openProject(projectBrowserItem: ProjectBrowserItem) {
    if (!projectBrowserItem.path || !fs.existsSync(projectBrowserItem.path)) {
      remote.dialog.showMessageBox({
        type: "error",
        title: "打开项目失败",
        message: "无法打开项目，请检查路径是否正确。"
      });

      return false;
    }

    console.log("ProjectBrowserWindow", ProjectBrowserWindow);

    ProjectBrowserWindow.hide();
    WorkspaceWindow.open(
      { project_dir: projectBrowserItem.path },
      { autoShow: false }
    );

    WorkspaceWindow.setTitle(`${projectBrowserItem.name} - AVG Workspace`);

    return true;
  }
}
