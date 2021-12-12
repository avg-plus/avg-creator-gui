import fs from "fs-extra";
import { assert } from "../../exception";
import { AVGFileStream } from "./file-stream";

export interface StoryItem {
  id: string;
  type: "dialogue" | "character";
  data: { [key: string]: any };
}
export interface StoryFileData {
  meta: { time: Date; version: string };
  stories: Array<StoryItem>;
}

export class StoryFileStream extends AVGFileStream<StoryFileData> {
  constructor(filename: string) {
    super(filename);
  }

  load(): StoryFileData {
    assert(fs.existsSync(this.filename), "Story file not exists.");

    const jsonData = fs.readJsonSync(this.filename) as StoryFileData;
    const meta = jsonData.meta;
    const stories = jsonData.stories;

    return {
      meta,
      stories
    };
  }

  save(data: StoryFileData) {
    fs.writeJsonSync(this.filename, data, {});

    return true;
  }
}
