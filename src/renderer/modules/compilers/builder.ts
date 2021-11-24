/**
 * 该模块用于生成底层的 AVGPlus 项目
 */

export class AVGProjectBuilder {
  init(projectRoot: string) {
    // 判断目录是否存在
  }

  private static createConfig() {
    const DEFAULT_GAME_CONFIG = {
      screen: {
        width: 800,
        height: 600,
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
