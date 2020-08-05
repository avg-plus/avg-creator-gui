import path from "path";
import fs from "fs-extra";
import { remote } from "electron";

import extract from "extract-zip";

import { isNullOrUndefined } from "util";
import { DBProjects } from "../../common/database/db-project";
import { LocalAppConfig } from "../../common/local-app-config";
import { Env } from "../../common/env";
import { TDAPP } from "../services/td-analytics";
import { BundleItem } from "../components/bundles-manager-dialog/bundles-manager-dialog";
import { BundleOption } from "../components/create-project-dialog/create-project-dialog";
import { template } from "underscore";
import { logger } from "../../common/lib/logger";

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

export class AVGProjectManager {
  static isWorkspaceInit() {
    const workspaceDir = LocalAppConfig.get("workspace");
    return !isNullOrUndefined(workspaceDir);
  }

  static async createProject(
    name: string,
    isSupportDesktop: boolean,
    isSupportBrowser: boolean,
    engineBundle: BundleOption,
    templateBundle: BundleOption
  ) {
    // 名称是否已存在
    const existedProject = await DBProjects.findOne({ name });
    if (existedProject) {
      throw "项目已存在";
    }

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
    project.name = name;
    project.description = "";
    project.dir = projectDir;
    project.templateHash = templateBundle.bundle.hash;
    project.engineHash = engineBundle.bundle.hash;
    project.supportBrowser = isSupportBrowser;
    project.supportDesktop = isSupportDesktop;

    // 保存到数据库
    const doc = await DBProjects.insert({
      ...project
    });

    TDAPP.onEvent("创建项目", "创建项目", project);

    project._id = doc._id;

    logger.debug("Created project", JSON.stringify(project));

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
    return await DBProjects.find({}).sort({ createdAt: 1 });
  }
}
