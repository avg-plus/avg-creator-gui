import path from "path";
import fs from "fs-extra";
import { remote } from "electron";
import { v4 as uuidv4 } from "uuid";

import extract from "extract-zip";

import { isNullOrUndefined } from "util";
import { DBProjects } from "../../common/database/db-project";
import { LocalAppConfig } from "../../common/local-app-config";
import { TDAPP } from "../services/td-analytics";
import { logger } from "../../common/lib/logger";
import { BundleOption } from "../components/create-project-dialog/create-project-dialog";

export class AVGProjectData {
  _id: string;
  name: string;
  description: string = "";
  dir: string;
  engineHash: string;
  templateHash: string;
  supportBrowser: boolean;
  supportDesktop: boolean;
}

export class AVGProjectRecord {
  dir: string;
}

export class AVGCreatorMeta {
  version: string;
}

export class RecentlyProjectRecord {
  dir: string;
}

export class AVGProjectManager {
  static isWorkspaceInit() {
    const workspaceDir = LocalAppConfig.get("workspace");
    return !isNullOrUndefined(workspaceDir);
  }

  static writeProjectFile(filename: string, project: AVGProjectData) {
    fs.writeJSONSync(filename, project);
  }

  static writeMetaFile(filename: string, meta: AVGCreatorMeta) {
    fs.writeJSONSync(filename, meta);
  }

  static async importProject(projectDir: string) {}

  private static readProject(dir: string): AVGProjectData {
    const projectEnvDir = path.join(dir, ".avg-creator");
    const projectFile = path.join(projectEnvDir, "project");

    return fs.readJSONSync(projectFile) as AVGProjectData;
  }

  static async generateProject(project: AVGProjectData) {
    // 创建工程文件
    const projectEnvDir = path.join(project.dir, ".avg-creator");
    fs.ensureDirSync(projectEnvDir);

    const projectFile = path.join(projectEnvDir, "project");
    this.writeProjectFile(projectFile, project);

    // 创建 creator 相关信息
    const metaFile = path.join(projectEnvDir, "meta");
    this.writeMetaFile(metaFile, {
      version: remote.app.getVersion()
    });
  }

  static async createProject(
    name: string,
    isSupportDesktop: boolean,
    isSupportBrowser: boolean,
    engineBundle: BundleOption,
    templateBundle: BundleOption
  ) {
    // 创建目录
    const workspace = LocalAppConfig.get("workspace");
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
    const defaultTemplateBundleFile = templateBundle.bundle.filename;

    if (!fs.existsSync(defaultTemplateBundleFile)) {
      remote.shell.moveItemToTrash(projectDir);
      throw "创建项目失败：无法读取模板项目";
    }

    // 解压模板项目到临时目录
    const temp = path.join(
      remote.app.getPath("temp"),
      templateBundle.bundle.hash
    );

    fs.removeSync(temp);
    await extract(defaultTemplateBundleFile, { dir: temp });

    // 拷贝到项目目录
    fs.copySync(path.join(temp, "bundle"), projectDir);

    const project = new AVGProjectData();
    project._id = uuidv4();
    project.name = name;
    project.description = "";
    project.dir = projectDir;
    project.templateHash = templateBundle.bundle.hash;
    project.engineHash = engineBundle.bundle.hash;
    project.supportBrowser = isSupportBrowser;
    project.supportDesktop = isSupportDesktop;

    // 生成相关工程文件
    await this.generateProject(project);

    // 保存到数据库
    const doc = await DBProjects.insert({
      _id: project._id,
      dir: project.dir
    });

    TDAPP.onEvent("创建项目", "创建项目", project);
    logger.info("Created project", JSON.stringify(project));

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
    const projects = await DBProjects.find<AVGProjectRecord>({}).sort({
      createdAt: 1
    });

    const list: AVGProjectData[] = [];
    projects.map((v) => {
      if (v.dir) {
        // 读取项目
        const project = this.readProject(v.dir);
        if (project) {
          list.push(project);
        }
      }
    });

    return list;
  }
}
