import fs, { Stats } from "fs-extra";
import fg from "fast-glob";
import path from "path";
import { assert } from "../exception";
import { ProjectFileReader } from "../services/file-reader/project-file-reader";
import { ObservableModule } from "../services/observable-module";
import { TreeItem } from "react-sortable-tree";

interface VerifiedFile {
  name: string;
  required: boolean;
  type: "file" | "directory";
}

interface PathObject {
  name: string;
  stats: Stats;
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

export class ProjectManagerV2 extends ObservableModule {
  constructor() {
    super();
  }

  loadProject(dir: string): TreeItem[] {
    if (!this.verifyProject(dir)) {
      throw new Error("加载项目出错");
    }

    const projectFile = path.join(dir, "project.avg");
    const storiesDir = path.join(dir, "stories");
    const dataDir = path.join(dir, "data");

    // 读取工程文件 project.avg
    const projectReader = new ProjectFileReader(projectFile);
    const data = projectReader.load();
    console.log("project data: ", data);

    // 读取故事树`${storiesDir}/**`
    const fileTree = this.buildFileTree(storiesDir);

    const convertPathObjectToTreeItem = (pathObjects: PathObject[]) => {
      const items: TreeItem[] = [];
      pathObjects.forEach((obj) => {
        const treeItem: TreeItem = {};
        treeItem.title = obj.name;
        if (obj.children?.length) {
          treeItem.children = convertPathObjectToTreeItem(obj.children);
        }

        items.push(treeItem);
      });

      return items;
    };

    const treeItems: TreeItem[] = convertPathObjectToTreeItem(fileTree);
    this._subject.next(treeItems);

    return [];
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
      const ext = path.extname(filePath);
      const stats = file.stats!;
      const relativePath = path.relative(dir, filePath);

      relativePath.split("/").reduce((r: { result: PathObject[] }, name) => {
        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({ name, stats, children: r[name].result });
        }

        return r[name];
      }, level);
    });

    return result;
  }

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
}

export default new ProjectManagerV2();
