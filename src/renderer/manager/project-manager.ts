import { nconf } from "./../../common/config";
import fs from "fs-extra";
import { ipcRenderer } from "electron-better-ipc";
import { IPCEvents } from "../../../src/common/ipc-events";
import { isNullOrUndefined } from "util";
import { DBProjects } from "../../common/database/db-project";

export class AVGProjectData {
  _id: string;
  name: string;
  description: string = "";
  dir?: string;
  host?: string = "127.0.0.1";
  listenPort?: number;
  screenWidth?: number = 800;
  screenHeight?: number = 600;
  isFullScreen?: boolean = false;
  textSpeed?: number = 80;
  autoPlay?: boolean = false;
  volume?: number = 100;
}

export class AVGProjectManager {
  static isWorkspaceInit() {
    const workspaceDir = nconf.get("workspace");
    return !isNullOrUndefined(workspaceDir);
  }

  static createProject(name: string, generateTutorial: boolean = true) {
    // 获取端口
    // TODO:
    const port = 0; // free port

    const project = new AVGProjectData();
    project.name = name;
    project.description = "";
    project.listenPort = port;

    // 保存到数据库
    console.log("DBProjects", DBProjects);

    DBProjects.insert({
      ...project
    });

    return project;
  }

  static async createFromExistsProject(dir: string) {
    const paths = await ipcRenderer.callMain<any, string[]>(
      IPCEvents.IPC_ShowOpenDialog,
      {
        title: "tring"
      }
    );
    if (!fs.existsSync(dir)) {
      throw "Not Exsits";
    }
  }

  static async deleteProject(id: string) {
    await DBProjects.remove({ _id: id }, {});

    return id;
  }

  static async loadProjects() {
    return await DBProjects.find({});
  }
}
