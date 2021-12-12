import { Stats } from "fs";
import path from "path";
import fg from "fast-glob";
import { nanoid } from "nanoid";

import { AVGTreeNodeModel } from "../../../common/models/tree-node-item";
import { ProjectFileData } from "../../../common/services/file-reader/project-file-reader";
import { StoryFileReader } from "../../../common/services/file-reader/story-file-reader";
import AVGProjectManager from "./project-manager";
import { ResourceTreeNodeTypes } from "../../../common/models/resource-tree-node-types";

interface PathObject {
  name: string;
  stats: Stats;
  path: string;
  children: PathObject[];
}

export class AVGProject {
  private projectData: ProjectFileData;
  private projectRootDir: string;

  loadProject(dir: string) {
    this.projectRootDir = dir;
    this.projectData = AVGProjectManager.readProjectData(this.projectRootDir);

    return this.projectData;
  }

  getData() {
    return this.projectData;
  }

  getStoryTree(): AVGTreeNodeModel[] {
    return this.projectData.file_tree;
  }

  setStoryTree(nodes: AVGTreeNodeModel[]) {
    this.projectData.file_tree = nodes;
  }

  addStory(parentID: string, text: string, data: any) {
    this.projectData.file_tree.push({
      id: nanoid(),
      text,
      parent: parentID,
      droppable: false,
      type: ResourceTreeNodeTypes.StoryNode,
      data
    });
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
