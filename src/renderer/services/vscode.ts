import fs from "fs-extra";
import { execFile } from "child_process";
import { Env } from "../../common/env";
import regedit from "regedit";

export class VSCode {
  static run(projectDir: string) {
    let codeBin = "";
    if (Env.getOSName() === "MacOS") {
      codeBin =
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code";
    } else if (Env.getOSName() === "Windows") {
      // regedit.list(
      //   "path\\to\\default\\value",
      //   (
      //     err: any,
      //     result: { [x: string]: { values: { [x: string]: { value: any } } } }
      //   ) => {
      //     var defaultValue =
      //       result["path\\to\\default\\value"].values[""].value;
      //   }
      // );
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
