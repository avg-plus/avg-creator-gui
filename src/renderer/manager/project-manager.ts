export class AVGProjectData {
  name: string;
  description: string = "";
  dir?: string;
  host?: string = "127.0.0.1";
  listenPort?: number;
  screenWidth?: number = 800;
  screenHeight?: number = 600;
  isFullScreen?: boolean = false;
  textSpeed?: number = 80;
  autoPlay?: boolean = false;
  volume?: number = 100;
}

export class AVGProjectManager {
  static createProject(name: string, description: string) {
    // 获取端口
    // TODO:
    const port = 2335;

    const project = new AVGProjectData();
    project.name = name;
    project.description = description;
    project.listenPort = port;

    return project;
  }

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
      }
    ];
  }
}
