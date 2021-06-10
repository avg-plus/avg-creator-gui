import fs from "fs-extra";
import { assert } from "../../../common/exception";
import { AVGFileReader } from "./file-reader";

export interface ProjectFileData {
  project_name: string;
  description: string;
  version: string;
}

export class ProjectFileReader extends AVGFileReader<ProjectFileData> {
  constructor(filename: string) {
    super(filename);
  }

  load() {
    const data = fs.readJsonSync(this.filename) as ProjectFileData;

    assert(data.version, `Missing field <version> in project`);
    assert(data.project_name, `Missing field <project_name> in project`);

    this.data = data;

    return this.data;
  }

  save() {
    fs.writeJsonSync(this.filename, this.data);

    return true;
  }
}
