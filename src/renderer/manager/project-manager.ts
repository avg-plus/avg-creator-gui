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
import { GUIToaster } from "../services/toaster";
import { Intent } from "@blueprintjs/core";
import { assert } from "../../common/exception";
import { BundlesManager } from "../services/bundles-manager/bundles-manager";

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

  static async importProject(projectDir: string) {
    try {
      const project = this.readProject(projectDir);
      if (!project) {
        return false;
      }

      // const project = new AVGProjectData();
      // project._id = uuidv4();
      // project.name = name;
      // project.description = "";
      // project.dir = projectDir;
      // project.templateHash = templateBundle.bundle.hash;
      // project.engineHash = engineBundle.bundle.hash;
      // project.supportBrowser = isSupportBrowser;
      // project.supportDesktop = isSupportDesktop;
    } catch (error) {
      GUIToaster.show({
        intent: Intent.DANGER,
        message: "读取项目失败。"
      });
    }

    return true;
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
    assert(workspace && fs.existsSync(workspace), "工作目录不存在");

    // 创建游戏目录
    const projectDir = path.join(workspace, name);
    assert(!fs.existsSync(projectDir), "创建游戏目录错误：目录已存在");

    fs.mkdirSync(projectDir);

    // 解压模板项目
    const result = this.extractTemplate(templateBundle, projectDir);
    assert(result, "加载模板项目失败", () => {
      remote.shell.moveItemToTrash(projectDir);
    });

    const project = new AVGProjectData();
    project._id = uuidv4();
    project.name = name;
    project.description = "";
    project.dir = projectDir;
    project.templateHash = templateBundle.bundle.hash;
    project.engineHash = engineBundle.bundle.hash;
    project.supportBrowser = isSupportBrowser;
    project.supportDesktop = isSupportDesktop;

    // 保存到数据库
    this.saveProjectRecord(project._id, project.dir);

    // 生成相关工程文件
    await this.generateProject(project);

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

  private static async extractTemplate(
    templateBundle: BundleOption,
    projectDir: string
  ) {
    // 查找模板项目
    const templateBundleFile = templateBundle.bundle.filename;
    if (!fs.existsSync(templateBundleFile)) {
      return false;
    }

    // 解压模板项目到临时目录
    const temp = path.join(
      remote.app.getPath("temp"),
      templateBundle.bundle.hash
    );

    await extract(templateBundleFile, { dir: temp });

    // 拷贝到项目目录
    fs.copySync(path.join(temp, "bundle"), projectDir);

    return true;
  }

  private static readProject(dir: string): AVGProjectData | null {
    const projectEnvDir = path.join(dir, ".avg-creator");
    const projectFile = path.join(projectEnvDir, "project");

    if (fs.existsSync(projectFile)) {
      return fs.readJSONSync(projectFile) as AVGProjectData;
    }

    return null;
  }

  private static async saveProjectRecord(id: string, dir: string) {
    // 保存到数据库
    await DBProjects.insert({
      _id: id,
      dir
    });
  }
}
