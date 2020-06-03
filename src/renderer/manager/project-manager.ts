import path from "path";
import fs from "fs-extra";
import { remote } from "electron";

import AdmZip from "adm-zip";

import { isNullOrUndefined } from "util";
import { DBProjects } from "../../common/database/db-project";
import { Config } from "../../common/config";
import { Env } from "../../common/env";

export class AVGProjectData {
  _id: string;
  name: string;
  description: string = "";
  dir: string;
  // host?: string = "127.0.0.1";
  // listenPort?: number;
  // screenWidth?: number = 800;
  // screenHeight?: number = 600;
  // isFullScreen?: boolean = false;
  // textSpeed?: number = 80;
  // autoPlay?: boolean = false;
  // volume?: number = 100;
}

export class AVGProjectManager {
  static isWorkspaceInit() {
    const workspaceDir = Config.get("workspace");
    return !isNullOrUndefined(workspaceDir);
  }

  static async createProject(name: string, generateTutorial: boolean = true) {
    // 名称是否已存在
    const existedProject = await DBProjects.findOne({ name });
    if (existedProject) {
      throw "项目已存在";
    }

    // 创建目录
    const workspace = Config.get("workspace");
    if (!workspace || !fs.existsSync(workspace)) {
      throw "工作目录不存在";
    }

    // 创建游戏目录
    const projectDir = path.join(workspace, name);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir);
    } else {
      throw "创建游戏目录错误：目录已存在";
    }

    // 查找模板项目
    const templatesDir = Env.getAVGProjectTemplateDir();
    const defaultTemplateBundleFile = path.join(templatesDir, "default.zip");
    if (!fs.existsSync(defaultTemplateBundleFile)) {
      remote.shell.moveItemToTrash(projectDir);
      throw "创建项目失败：无法读取模板项目";
    }

    // 解压模板项目
    var zip = new AdmZip(defaultTemplateBundleFile);
    zip.extractAllTo(projectDir, true);

    const project = new AVGProjectData();
    project.name = name;
    project.description = "";
    project.dir = projectDir;

    // 保存到数据库
    const doc = await DBProjects.insert({
      ...project
    });

    project._id = doc._id;

    console.log("Created project", project);

    return project;
  }

  static async deleteProject(id: string) {
    const existedProject = await DBProjects.findOne<AVGProjectData>({
      _id: id
    });

    if (existedProject) {
      const fullpath = existedProject.dir;

      // 删除项目
      await DBProjects.remove({ _id: id }, {});
      if (!remote.shell.moveItemToTrash(fullpath, true)) {
        throw "删除游戏目录失败，目录可能已不存在";
      }
    }

    return id;
  }

  static async loadProjects() {
    return await DBProjects.find({});
  }
}
