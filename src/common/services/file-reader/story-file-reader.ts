import fs from "fs-extra";
import { assert } from "../../exception";
import { AVGFileReader } from "./file-reader";

interface StoryFileData {
  meta: { [key: string]: any };
  stories: Array<{
    type: number;
    data: { [key: string]: any };
  }>;
}

export class StoryFileReader extends AVGFileReader<StoryFileData> {
  constructor(filename: string) {
    super(filename);
  }

  load(): StoryFileData {
    assert(fs.existsSync(this.filename), "Story file not exists.");

    const jsonData = fs.readJsonSync(this.filename) as StoryFileData;
    const meta = jsonData.meta;
    const stories = jsonData.stories;

    console.log("jsonData", jsonData);

    return {
      meta,
      stories
    };
  }

  save() {
    fs.writeJsonSync(this.filename, this.data);

    return true;
  }
}
