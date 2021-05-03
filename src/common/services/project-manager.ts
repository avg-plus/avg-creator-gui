import fs, { Stats } from "fs-extra";
import fg from "fast-glob";
import path from "path";
import { assert } from "../exception";
import {
  ProjectFileData,
  ProjectFileReader
} from "../services/file-reader/project-file-reader";
import { ObservableContext } from "../services/observable-module";
import { AVGTreeNode } from "../models/tree-node";
import { ResourceTreeNodeTypes } from "../models/resource-tree-node-types";
import { GlobalEvents } from "../global-events";
import { StoryFileReader } from "../services/file-reader/story-file-reader";
import { Nullable } from "../traits";

interface VerifiedFile {
  name: string;
  required: boolean;
  type: "file" | "directory";
}

interface PathObject {
  name: string;
  stats: Stats;
  path: string;
  children: PathObject[];
}

const VerifyFileList = [
  {
    name: "project.avg",
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

export class AVGProjectManager {
  private projectRootDir: string;
  projectData: ProjectFileData;

  loadProject(dir: string) {
    if (!this.verifyProject(dir)) {
      throw new Error("加载项目出错");
    }

    this.projectRootDir = dir;

    const projectFile = path.join(dir, "project.avg");
    const storiesDir = this.getDir("stories");
    const dataDir = this.getDir("data");

    // 读取工程文件 project.avg
    const projectReader = new ProjectFileReader(projectFile);
    this.projectData = projectReader.load();

    // 读取故事树
    const fileTree = this.buildFileTree(storiesDir);
    const convertPathObjectToTreeItem = (pathObjects: PathObject[]) => {
      const items: AVGTreeNode[] = [];
      pathObjects.forEach((obj) => {
        const treeItem: Partial<AVGTreeNode> = {};
        treeItem.title = obj.name;
        if (obj.children?.length) {
          treeItem.children = convertPathObjectToTreeItem(obj.children);
        }

        treeItem.data = {
          nodeType: obj.stats.isDirectory()
            ? ResourceTreeNodeTypes.Folder
            : ResourceTreeNodeTypes.StoryNode,
          MD5: "",
          path: obj.path
        };

        items.push(treeItem as AVGTreeNode);
      });

      return items;
    };

    const treeItems: AVGTreeNode[] = convertPathObjectToTreeItem(fileTree);

    ObservableContext.next(GlobalEvents.OnProjectLoaded, treeItems);
  }

  openStory(filename: string) {
    const storyReader = new StoryFileReader(filename);
    return storyReader.load();
  }

  saveStory(data: any) {}

  private buildFileTree(dir: string, extensions = []) {
    const files = fg.sync(`${dir}/**/*`, {
      objectMode: true,
      onlyFiles: false,
      stats: true,
      markDirectories: true,
      dot: false
    });

    let result: PathObject[] = [];
    let level = { result };

    files.forEach((file) => {
      const filePath = file.path;
      const ext = path.extname(filePath);
      const stats = file.stats!;
      const relativePath = path.relative(dir, filePath);

      relativePath.split("/").reduce((r: { result: PathObject[] }, name) => {
        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({
            name,
            stats,
            path: filePath,
            children: r[name].result
          });
        }

        return r[name];
      }, level);
    });

    return result;
  }

  generateIndexes() {}

  private verifyProject(dir: string) {
    assert(fs.existsSync(dir), "项目目录不存在");

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

  getDir(dir: "stories" | "data") {
    switch (dir) {
      case "stories":
        return path.join(this.projectRootDir, "stories");
      case "data":
        return path.join(this.projectRootDir, "data");
    }
  }
}

export default new AVGProjectManager();
