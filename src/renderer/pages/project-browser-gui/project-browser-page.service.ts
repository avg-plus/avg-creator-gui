import { remote } from "electron";
import fs from "fs-extra";

import { GlobalEvents } from "../../../common/global-events";
import { AVGProjectManager } from "../../../common/services/project-manager";
import { ProjectBrowserWindow } from "../../windows/project-browser-window";
import { ProjectWizardWindow } from "../../windows/project-wizard-window";
import { ProjectResourceService } from "../project-resource-gui/project-resource-page.service";
import { WorkspaceWindow } from "../../windows/workspace-window";

import ipcObservableRenderer from "../../../common/ipc-observable/ipc-observable-renderer";
import { DBProjects } from "../../common/remote-objects/remote-database";

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

export class ProjectBrowserService {
  // pass project path to main window

  static async init() {
    // 预先加载创建项目窗口
    await ProjectWizardWindow.setParent(ProjectBrowserWindow);
    await ProjectWizardWindow.preload();
  }

  static async loadProjectList(): Promise<ProjectBrowserItem[]> {
    const projects = await DBProjects.find({}).sort({ updatedAt: -1 });
    const list: ProjectBrowserItem[] = [];

    projects.forEach((v) => {
      const path = v["path"];

      if (fs.existsSync(path)) {
        // 尝试读取项目文件
        const data = AVGProjectManager.readProjectData(path);

        list.push({
          id: v._id,
          itemType: "recently-project",
          path: path,
          description: data.description,
          name: data.project_name
        } as ProjectBrowserItem);
      }
    });

    console.log("load projects", projects);

    return list;
  }

  static async removeProject(projectBrowserItem: ProjectBrowserItem) {
    await DBProjects.remove({ _id: projectBrowserItem.id }, { multi: true });
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
    if (AVGProjectManager.verifyProject(dir)) {
      await AVGProjectManager.addProjectRecord(dir);
      return "success";
    }

    return "failed";
  }

  static async openProjectInWorkspace(projectBrowserItem: ProjectBrowserItem) {
    if (projectBrowserItem.itemType === "add-new") {
      (
        await ProjectWizardWindow.open({
          parent: {
            windowID: ProjectBrowserWindow.id,
            instance: "default"
          }
        })
      )?.show();

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

    // ProjectBrowserWindow.close();
    await WorkspaceWindow.open(
      { project_dir: projectBrowserItem.path },
      `${projectBrowserItem.id}`
    );

    await WorkspaceWindow.setTitle(
      `${projectBrowserItem.name} - AVG Workspace`
    );

    return true;
  }

  static async openProjectResourceWorkspace(
    projectBrowserItem: ProjectBrowserItem
  ) {
    ProjectResourceService.openProjectResourceWorkspace(
      projectBrowserItem.id,
      projectBrowserItem.path,
      projectBrowserItem.name
    );
    console.log(projectBrowserItem);
  }
}
