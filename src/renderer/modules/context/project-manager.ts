import fs from "fs-extra";
import path from "path";
import { DBProjects } from "../../common/remote-objects/remote-database";
import { ProjectFileStream } from "../../../common/services/file-reader/project-file-stream";
import { AVGProject } from "./project";
import {
  StoryFileData,
  StoryFileStream,
  StoryItem
} from "../../../common/services/file-reader/story-file-stream";
import { Env } from "../../common/remote-objects/remote-env";
import { assert } from "../../../common/exception";
import { AVGTreeNodeID } from "../../../common/models/tree-node-item";

const EXT_STORY_FILE = ".story";
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
  async createEmptyProject(
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

  async addProjectRecord(path: string) {
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

  readProjectData(projectDir: string) {
    if (!this.verifyProject(projectDir)) {
      throw new Error("加载项目出错");
    }

    const projectFile = path.join(projectDir, PROJECT_FILE_NAME);

    // 读取工程文件 project.avg
    const projectReader = new ProjectFileStream(projectFile);

    return projectReader.load();
  }

  saveProject(project: AVGProject) {
    const projectDir = project.getDir("root");
    if (!this.verifyProject(projectDir)) {
      throw new Error("保存项目出错");
    }

    const projectFile = path.join(projectDir, PROJECT_FILE_NAME);

    // 读取工程文件 project.avg
    fs.writeJSONSync(projectFile, project.getData());
  }

  createStoryFile(prject: AVGProject, id: AVGTreeNodeID) {
    // 文件是否存在
    const filename = this.getStoryFilePath(prject, id);
    assert(!fs.existsSync(filename), "文件已经存在。");

    const data = {
      meta: { time: new Date(), version: Env.getAppVersion() },
      stories: []
    } as StoryFileData;

    // 默认添加一行空白块
    // data.stories.push({
    //   id: nanoid()
    // } as StoryItem)

    const storyFile = new StoryFileStream(filename);
    storyFile.save(data);

    return true;
  }

  deleteStoryFile(prject: AVGProject, id: AVGTreeNodeID) {
    // 文件是否存在
    const filename = this.getStoryFilePath(prject, id);
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
  }

  getStoryFilePath(prject: AVGProject, id: AVGTreeNodeID) {
    const storyDir = prject.getDir("stories");

    // 文件是否存在
    return path.join(storyDir, `${id}${EXT_STORY_FILE}`);
  }

  verifyProject(dir: string) {
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

export default new AVGProjectManager();
