import { Stats } from "fs";
import path from "path";
import fg from "fast-glob";

import { GlobalEvents } from "../../../common/global-events";
import { ResourceTreeNodeTypes } from "../../../common/models/resource-tree-node-types";
import { AVGTreeNode } from "../../../common/models/tree-node";
import {
  ProjectFileData,
  ProjectFileReader
} from "../../../common/services/file-reader/project-file-reader";
import { StoryFileReader } from "../../../common/services/file-reader/story-file-reader";
import { ObservableContext } from "../../../common/services/observable-module";
import { AVGProjectManager } from "./project-manager";

interface PathObject {
  name: string;
  stats: Stats;
  path: string;
  children: PathObject[];
}

export class AVGProject {
  private projectRootDir: string;
  projectData: ProjectFileData;

  loadProject(dir: string) {
    this.projectRootDir = dir;
    this.projectData = AVGProjectManager.readProjectData(this.projectRootDir);

    const storiesDir = this.getDir("stories");

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

  saveStory(filename: string, data: any) {
    const storyReader = new StoryFileReader(filename);
    storyReader.save(data);
  }

  generateIndexes() {}

  getDir(dir: "root" | "stories" | "data") {
    switch (dir) {
      case "root":
        return this.projectRootDir;
      case "stories":
        return path.join(this.projectRootDir, "stories");
      case "data":
        return path.join(this.projectRootDir, "data");
    }
  }

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
}
