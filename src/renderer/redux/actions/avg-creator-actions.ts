export enum AVGCreatorActionType {
  // 进入设置面板
  OpenSettingPanel = "OpenSettingPanel",

  // 退出设置面板
  CloseSettingPanel = "CloseSettingPanel",

  // 打开创建项目对话框
  ToggleCreateProjectDialog = "ToggleCreateProjectDialog",

  // 打开设置工作目录对话框
  ToggleSetWorkspaceDialog = "ToggleSetWorkspaceDialog",

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

  // 设置默认引擎
  SetDefaultEngine = "SetDefaultEngine"
}

export class AVGCreatorAction {
  type: AVGCreatorActionType;
  payload?: any;
}
