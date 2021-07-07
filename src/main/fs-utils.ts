import fs from "fs-extra";
import path from "path";

export class FSUtils {
  static enumFiles(directory: string, ext: string): string[] {
    const filePaths: string[] = [];
    const directories = [directory];
    directories.forEach((curDir) => {
      const names = fs.readdirSync(curDir);
      names.forEach((name) => {
        if (!ext || !name.endsWith(ext)) {
          return;
        }

        filePaths.push(path.resolve(curDir, name));
      });
    });

    return filePaths;
  }
}
