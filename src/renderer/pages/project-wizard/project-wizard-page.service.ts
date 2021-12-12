import { remote } from "electron";
import fs from "fs-extra";
import { GlobalEvents } from "../../../common/global-events";
import ipcObservableRenderer from "../../../common/ipc-observable/ipc-observable-renderer";
import AVGProjectManager from "../../modules/context/project-manager";
import { ProjectWizardWindow } from "../../windows/project-wizard-window";

export class ProjectWizardService {
  static close() {
    ProjectWizardWindow.close();
  }

  static validateProjectName(projectName: string) {
    return /^[^<>:;,?"'@#$*|/]+$$/.test(projectName);
  }

  static validateProjectDescription(description: string) {
    return true;
  }

  static validateProjectPath(dir: string) {
    if (!dir || !dir.length) {
      return false;
    }

    return this.getPathStatus(dir) === "";
  }

  static async createProject(
    projectName: string,
    description: string,
    dir: string
  ) {
    if (!this.validateProjectName(projectName)) {
      return "请输入合法的项目名称。项目名应是一个合法的文件名，不允许带有特殊符号。";
    }

    if (!this.validateProjectPath(dir)) {
      return "请选择合法的储存路径。";
    }

    try {
      await AVGProjectManager.createEmptyProject(dir, projectName, description);
      ipcObservableRenderer.broadcast(GlobalEvents.ReloadProjectList, {});
    } catch (error) {
      return "无法创建项目：" + error;
    }

    return "";
  }

  static getPathStatus(dir: string) {
    if (!dir.length) {
      return "";
    }

    try {
      if (!fs.existsSync(dir)) {
        return "目录不存在";
      }

      if (!fs.lstatSync(dir).isDirectory()) {
        return "不是一个合法的目录";
      }
    } catch (error) {
      return error;
    }

    return "";
  }

  static selectProjectDir() {
    const paths = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
      title: "选择储存目录",
      properties: ["createDirectory", "openDirectory", "promptToCreate"]
    });

    if (paths?.length) {
      return paths[0];
    }

    return null;
  }
}
