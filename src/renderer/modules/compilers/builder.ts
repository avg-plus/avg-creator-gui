/**
 * 该模块用于生成底层的 AVGPlus 项目
 */

import fs from "fs-extra";
import path from "path";
import { logger } from "../../common/lib/logger";
import { WorkspaceContext } from "../context/workspace-context";
import { Codegen, CodegenContext } from "./codegen";

export class AVGProjectBuilder {
  static hiddenGeneratedProjectDir: string = "";

  static build() {
    this.createProjectStructure();
  }

  private static async createProjectStructure() {
    const project = WorkspaceContext.getCurrentProject();
    const projectRoot = project.getDir("root");
    this.hiddenGeneratedProjectDir = path.join(projectRoot, ".avg-project");

    const SCRIPT_DIR = path.join(this.hiddenGeneratedProjectDir, "scripts");
    const GRAPHICS_DIR = path.join(this.hiddenGeneratedProjectDir, "graphics");
    const AUDIO_DIR = path.join(this.hiddenGeneratedProjectDir, "audio");

    // 1. 生成底层项目目录结构
    [SCRIPT_DIR, GRAPHICS_DIR, AUDIO_DIR].forEach((v) => {
      fs.mkdirpSync(v);
    });

    // 2. 生成基础游戏配置
    const config = this.createConfig();
    fs.writeFileSync(
      path.join(this.hiddenGeneratedProjectDir, "game.json"),
      config
    );

    // 3. 编译游戏脚本
    const trees = project.getStoryTrees();
    for (let i = 0; i < trees.length; i++) {
      const file = trees[i];
      const data = project.openStory(file.data.path);

      const context = new CodegenContext();
      const generator = new Codegen(context);
      const content = await generator.run(data);

      fs.writeFileSync(
        path.join(SCRIPT_DIR, path.basename(file.data.path, ".story") + ".avs"),
        content
      );
    }
  }

  private static createConfig() {
    return {
      screen: {
        width: 1920,
        height: 1080,
        fullscreen: false
      },
      game: {
        text_speed: 80,
        auto_play: false,
        sound: {
          bgm: 100,
          bgs: 100,
          se: 100,
          voice: 100
        }
      }
    };
  }
}
