import { remote } from "electron";
import fs from "fs-extra";

import { DBProjects } from "../../../common/database/db-project";
import ProjectManager from "../../../common/services/project-manager";
import { ProjectBrowserWindow } from "../../windows/project-browser-window";
import { WorkspaceWindow } from "../../windows/workspace-window";

export type ProjectBrowserItemType =
  | "recently-project"
  | "templates"
  | "add-new";
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

  static async removeProject(projectBrowserItem: ProjectBrowserItem) {
    // remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
    //   title: "移除最近项目",
    //   message: `要从最近项目中移除 [${projectBrowserItem.name}] 吗？`,
    //   detail: "此操作不会实际删除您硬盘中的数据",
    //   checkboxLabel: "以后不再提醒",
    //   buttons: ["确认", "取消"]
    // });

    await DBProjects.remove({ _id: projectBrowserItem.id }, { multi: true });
  }

  static async addProject(path: string) {
    const project = await DBProjects.findOne({ path });
    if (!project) {
      // 尝试读取项目文件
      await DBProjects.insert({
        path: path
      });
    } else {
      await DBProjects.update(
        { _id: project._id },
        { $set: { updatedAt: new Date() } }
      );
    }
  }

  static async addLocalProject() {
    const paths = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
      title: "打开本地 AVG 项目",
      properties: ["openDirectory"]
    });

    if (!paths) {
      return "cancel";
    }

    if (!paths.length) {
      return "failed";
    }

    const dir = paths[0];

    // 读取项目
    if (ProjectManager.verifyProject(dir)) {
      await this.addProject(dir);
      return "success";
    }

    return "failed";
  }

  static async openProjectInWorkspace(projectBrowserItem: ProjectBrowserItem) {
    if (projectBrowserItem.itemType === "add-new") {
      // add new project
      return;
    }

    if (!projectBrowserItem.path || !fs.existsSync(projectBrowserItem.path)) {
      remote.dialog.showMessageBox({
        type: "error",
        title: "打开项目失败",
        message: "无法打开项目，请检查路径是否正确。"
      });

      return false;
    }

    await ProjectBrowserWindow.close();
    await WorkspaceWindow.open(
      { project_dir: projectBrowserItem.path },
      `${projectBrowserItem.id}`
    );

    await WorkspaceWindow.setTitle(
      `${projectBrowserItem.name} - AVG Workspace`
    );

    return true;
  }
}
