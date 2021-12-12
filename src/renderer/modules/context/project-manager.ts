import fs from "fs-extra";
import path from "path";
import { DBProjects } from "../../common/remote-objects/remote-database";
import { ProjectFileReader } from "../../../common/services/file-reader/project-file-reader";
import { AVGProject } from "./project";

const PROJECT_FILE_NAME = "project.avg";
interface VerifiedFile {
  name: string;
  required: boolean;
  type: "file" | "directory";
}

const VerifyFileList = [
  {
    name: PROJECT_FILE_NAME,
    type: "file",
    required: true
  },
  {
    name: "data",
    type: "directory",
    required: false
  },
  {
    name: "stories",
    type: "directory",
    required: false
  }
] as VerifiedFile[];

class AVGProjectManager {
  static async createEmptyProject(
    dir: string,
    project_name: string,
    description: string
  ) {
    try {
      const projectDir = path.join(dir, project_name);
      const dataDir = path.join(projectDir, "data");
      const storiesDir = path.join(projectDir, "stories");
      const projectFile = path.join(projectDir, PROJECT_FILE_NAME);
      await this.addProjectRecord(projectDir);

      fs.mkdirpSync(projectDir);
      fs.mkdirSync(dataDir);
      fs.mkdirSync(storiesDir);

      fs.writeJsonSync(projectFile, {
        project_name,
        description,
        version: "1.0",
        file_tree: []
      });
    } catch (error) {
      throw error;
    }
  }

  static async addProjectRecord(path: string) {
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

  static readProjectData(projectDir: string) {
    if (!AVGProjectManager.verifyProject(projectDir)) {
      throw new Error("加载项目出错");
    }

    const projectFile = path.join(projectDir, PROJECT_FILE_NAME);

    // 读取工程文件 project.avg
    const projectReader = new ProjectFileReader(projectFile);

    return projectReader.load();
  }

  static saveProject(project: AVGProject) {
    const projectDir = project.getDir("root");
    if (!AVGProjectManager.verifyProject(projectDir)) {
      throw new Error("保存项目出错");
    }

    const projectFile = path.join(projectDir, PROJECT_FILE_NAME);

    // 读取工程文件 project.avg
    fs.writeJSONSync(projectFile, project.getData());
  }

  static verifyProject(dir: string) {
    if (!fs.existsSync(dir)) {
      return false;
    }

    for (let i = 0; i < VerifyFileList.length; ++i) {
      const v = VerifyFileList[i];

      const filePath = path.join(dir, `/${v.name}`);
      const exists = fs.existsSync(filePath);

      if (v.type === "directory") {
        if (v.required && !exists) {
          return false;
        }

        if (!exists) {
          fs.mkdirSync(path.join(dir, `/${v.name}`));
        }
      } else if (v.type === "file") {
        if (v.required && !exists) {
          return false;
        }
      }
    }

    return true;
  }
}

export default AVGProjectManager;
