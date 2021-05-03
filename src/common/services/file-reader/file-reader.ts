import md5 from "md5-file";

export abstract class AVGFileReader<T> {
  protected filename: string;
  protected data: T;
  private MD5: string;

  protected constructor(filename: string) {
    this.filename = filename;
    this.MD5 = md5.sync(filename);
  }

  getMD5() {
    return this.MD5;
  }

  abstract load(): T;
  abstract save(): boolean;
}
