import fs, { Stats } from "fs-extra";
import fg from "fast-glob";
import path from "path";
import { assert } from "../../common/exception";
import { ProjectFileReader } from "../services/file-reader/project-file-reader";

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

export class ProjectManagerV2 {
  static loadProject(dir: string) {
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

    console.log("file tree: ", fileTree);
  }

  private static buildFileTree(dir: string, extensions = []) {
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

      relativePath.split("/").reduce((r, name) => {
        if (!r[name]) {
          r[name] = { result: [] };
          r.result.push({ name, stats, children: r[name].result });
        }

        return r[name];
      }, level);
    });
    return result;
  }

  private static verifyProject(dir: string) {
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
