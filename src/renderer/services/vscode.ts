import fs from "fs-extra";
import { execFile, execSync } from "child_process";
import { Env } from "../../common/env";
import commandExists from "command-exists";
import { logger } from "../../common/lib/logger";
import { shell } from "electron";

export class VSCode {
  static async run(projectDir: string) {
    const parameters = [projectDir];

    const exception = new Error(
      "无法找到 VSCode 的可执行文件，请确保已正确安装 Visual Studio Code ."
    );

    let codeBin = "";
    if (Env.getOSName() === "MacOS") {
      codeBin =
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code";

      if (fs.existsSync(codeBin)) {
        execFile(codeBin, parameters);
      } else {
        throw exception;
      }
    } else if (Env.getOSName() === "Windows") {
      const code = commandExists.sync("code");
      if (code) {
        codeBin = "code";
        execSync(`${codeBin} ${projectDir}`);
      } else {
        throw exception;
      }
    }
  }
}
