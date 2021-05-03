import fs from "fs-extra";
import { assert } from "../../exception";
import { AVGFileReader } from "./file-reader";

interface IndexesFileData {}

export class IndexesFileReader extends AVGFileReader<IndexesFileData> {
  constructor(filename: string) {
    super(filename);
  }

  load() {
    assert(fs.existsSync(this.filename), "Indexes file not exists.");

    return {};
  }

  save() {
    fs.writeJsonSync(this.filename, this.data);

    return true;
  }
}
