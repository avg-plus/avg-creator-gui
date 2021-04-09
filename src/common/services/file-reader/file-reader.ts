export abstract class AVGFileReader<T> {
  protected filename: string;
  protected data: T;

  protected constructor(filename: string) {
    this.filename = filename;
  }

  abstract load(): T;
  abstract save(): boolean;
}
