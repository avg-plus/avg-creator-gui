import fs from "fs-extra";
import { assert } from "../../exception";
import { AVGTreeNodeModel } from "../../models/tree-node-item";
import { AVGFileStream } from "./file-stream";
export interface ProjectFileData {
  project_name: string;
  description: string;
  version: string;
  file_tree: AVGTreeNodeModel[];
}

export class ProjectFileStream extends AVGFileStream<ProjectFileData> {
  constructor(filename: string) {
    super(filename);
  }

  load() {
    const data = fs.readJsonSync(this.filename) as ProjectFileData;

    assert(data.version, `Missing field <version> in project`);
    assert(data.project_name, `Missing field <project_name> in project`);

    this.data = data;
    this.data.file_tree = this.data.file_tree ?? [];

    return this.data;
  }

  save() {
    fs.writeJsonSync(this.filename, this.data);

    return true;
  }
}
