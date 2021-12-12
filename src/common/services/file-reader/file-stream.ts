import fs from "fs-extra";
import md5 from "md5-file";

export abstract class AVGFileStream<T> {
  protected filename: string;
  protected data: T;
  private MD5: string;

  protected constructor(filename: string) {
    this.filename = filename;

    // 不存在则自动创建
    if (!fs.pathExistsSync(filename)) {
      fs.writeFileSync(filename, "");
    }

    this.calcMD5();
  }

  getMD5() {
    return this.MD5;
  }

  protected calcMD5() {
    this.MD5 = md5.sync(this.filename);
  }

  abstract load(): T;
  abstract save(data: T): boolean;
}
