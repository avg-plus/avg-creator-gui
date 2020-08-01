import fs from "fs-extra";
import { execFile } from "child_process";
import { Env } from "../../common/env";

export class VSCode {
  static run(projectDir: string) {
    let codeBin = "";
    if (Env.getOSName() === "MacOS") {
      codeBin =
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code";
    } else if (Env.getOSName() === "Windows") {
      codeBin =
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/cod1e";
    }

    const parameters = [projectDir];

    if (fs.existsSync(codeBin)) {
      execFile(codeBin, parameters);
    } else {
      throw "无法找到 VSCode 的可执行文件，请确保已正确安装 Visual Studio Code .";
    }
  }
}
