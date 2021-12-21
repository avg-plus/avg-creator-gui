import { Stats } from "fs-extra";
import path from "path";
import fg from "fast-glob";

import {
  AVGTreeNodeModel,
  AVGTreeNodePersistence
} from "../../../common/models/tree-node-item";
import { ProjectFileData } from "../../../common/services/file-reader/project-file-stream";
import { StoryFileStream } from "../../../common/services/file-reader/story-file-stream";
import AVGProjectManager from "./project-manager";
import { FileTreeService } from "../../pages/workspace/views/file-tree/file-tree.service";

interface PathObject {
  name: string;
  stats: Stats;
  path: string;
  children: PathObject[];
}

export class AVGProject {
  private projectData: ProjectFileData;
  private projectRootDir: string;
  private treeService: FileTreeService;

  constructor() {
    this.treeService = new FileTreeService(this);
  }

  loadProject(dir: string) {
    this.projectRootDir = dir;
    this.projectData = AVGProjectManager.readProjectData(this.projectRootDir);

    return this.projectData;
  }

  getTreeService() {
    return this.treeService;
  }

  getData() {
    return this.projectData;
  }

  getStoryTree(): AVGTreeNodePersistence[] {
    return this.projectData.file_tree;
  }

  setStoryTree(nodes: AVGTreeNodePersistence[]) {
    this.projectData.file_tree = nodes;
  }

  openStory(filename: string) {
    const storyReader = new StoryFileStream(filename);
    return storyReader.load();
  }

  saveStory(filename: string, data: any) {
    const storyReader = new StoryFileStream(filename);
    storyReader.save(data);
  }

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

  onFileContentChanged(node: AVGTreeNodeModel) {
    console.log("file changed: ", node);
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
