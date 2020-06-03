import os from "os";
import fs from "fs-extra";
import { execFile } from "child_process";
import { shell } from "electron";

export class VSCode {
  static run(projectDir: string) {
    if (os.platform() === "darwin") {
      const code =
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code";
      const parameters = [projectDir];

      if (fs.existsSync(code)) {
        execFile(code, parameters);
      } else {
        throw "无法找到 VSCode 的可执行文件，请确保已正确安装 Visual Studio Code.";
      }
    }
  }
}
