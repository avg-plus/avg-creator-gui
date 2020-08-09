export enum AVGCreatorActionType {
  // 打开创建项目对话框
  OpenCreateProjectDialog = "OpenCreateProjectDialog",

  // 打开项目详情
  OpenProjectDetailDialog = "OpenProjectDetailDialog",

  // 打开关于对话框
  OpenAboutDialog = "OpenAboutDialog",

  // 打开设置工作目录对话框
  OpenSetWorkspaceDialog = "OpenSetWorkspaceDialog",

  // 打开更新日志对话框
  OpenChangeLogDialog = "OpenChangeLogDialog",

  // 检查更新提醒
  CheckUpdateAlert = "CheckUpdateAlert",

  // 增加项目
  AddProjectItem = "AddProjectItem",

  // 删除项目
  RemoveProjectItem = "RemoveProjectItem",

  // 设置项目列表
  SetProjectList = "SetProjectList",

  // 选择项目
  SelectProjectItem = "SelectProjectItem",

  // 创建项目
  CreateProject = "CreateProject",

  // 开启服务
  StartServer = "StartServer",

  // 启动游戏客户端
  LaunchGame = "LaunchGame",

  // 设置默认引擎
  SetDefaultEngine = "SetDefaultEngine"
}

export class AVGCreatorAction {
  type: AVGCreatorActionType;
  payload?: any;
}
