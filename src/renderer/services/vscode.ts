import fs from "fs-extra";
import { execFile } from "child_process";
import { Env } from "../../common/env";
import commandExists from "command-exists";

export class VSCode {
  static async run(projectDir: string) {
    const exception =
      "无法找到 VSCode 的可执行文件，请确保已正确安装 Visual Studio Code .";
    let codeBin = "";
    if (Env.getOSName() === "MacOS") {
      codeBin =
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code";
    } else if (Env.getOSName() === "Windows") {
      const key = `HKCU\\Software\\Classes\\*\\shell\\VSCode`;
      if (commandExists.sync("code")) {
        codeBin = "code";
      } else {
        throw exception;
      }

      // commandExists.
      // codeBin = await new Promise<string>((resolve, reject) => {
      //   regedit.list(
      //     key,
      //     (
      //       err: any,
      //       result: { [x: string]: { values: { [x: string]: { value: any } } } }
      //     ) => {
      //       if (err) {
      //         reject();
      //       }

      //       const reg = result[key].values["Icon"];
      //       if (reg) {
      //         const value = reg.value;
      //         resolve(value);
      //       }

      //       reject()
      //     }
      //   );
      // }).catch(() => {
      //   throw exception;
      // })
    }

    const parameters = [projectDir];

    if (fs.existsSync(codeBin)) {
      execFile(codeBin, parameters);
    } else {
      throw exception;
    }
  }
}
