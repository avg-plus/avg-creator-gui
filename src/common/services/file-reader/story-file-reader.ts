import fs from "fs-extra";
import { assert } from "../../exception";
import { AVGFileReader } from "./file-reader";

export interface StoryFileData {
  meta: { [key: string]: any };
  stories: Array<{
    id: string;
    type: string;
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

  save(data: StoryFileData) {
    fs.writeJsonSync(this.filename, data);

    return true;
  }
}
