export enum AVGCreatorActionType {
  // 进入设置面板
  OpenSettingPanel = "OpenSettingPanel",

  // 退出设置面板
  CloseSettingPanel = "CloseSettingPanel",

  // 打开创建项目对话框
  ToggleCreateProjectDialog = "ToggleCreateProjectDialog",

  // 创建项目
  CreateProject = "CreateProject"
}

export class AVGCreatorAction {
  type: AVGCreatorActionType;
  payload?: any;
}
