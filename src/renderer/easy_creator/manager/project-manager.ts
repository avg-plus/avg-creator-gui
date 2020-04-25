
export interface AVGProjectData {
  name: string;
  description: string;
  dir: string;
  host: string;
  listenPort: number;
  screenWidth: number;
  screenHeight: number;
  isFullScreen: boolean;
  textSpeed: number;
  autoPlay: boolean;
  volume: number;
}

export class AVGProjectManager {
  static loadProjectList(): Array<AVGProjectData> {

    // 临时列表
    return [
      {
        name: "游戏 Demo",
        description: "明明是我先来……",
        dir: "dir/to/a/b/c",
        host: "localhost",
        listenPort: 2336,
        screenWidth: 800,
        screenHeight: 600,
        isFullScreen: true,
        textSpeed: 20,
        autoPlay: true,
        volume: 80
      },
      {
        name: "白色相簿2",
        description: "明明是我先来……",
        dir: "dir/to/a/b/c",
        host: "localhost",
        listenPort: 2336,
        screenWidth: 1920,
        screenHeight: 1080,
        isFullScreen: false,
        textSpeed: 80,
        autoPlay: false,
        volume: 80
      },
    ]
  }
}