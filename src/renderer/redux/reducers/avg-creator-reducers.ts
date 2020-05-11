import {
  AVGCreatorActionType,
  AVGCreatorAction
} from "./../actions/avg-creator-actions";
import {
  AVGProjectData,
  AVGProjectManager
} from "../../manager/project-manager";

export interface IAVGCreatorInitialState {
  isSettingPanelOpen: boolean;
  isShowPanelHeader: boolean;
  isCreateProjectDialogOpen: boolean;
  projects: AVGProjectData[];
}

export const AVGCreatorInitialState: IAVGCreatorInitialState = {
  isSettingPanelOpen: true,
  isShowPanelHeader: false,
  isCreateProjectDialogOpen: false,
  projects: []
};

export function AVGCreatorReducer(
  state: IAVGCreatorInitialState,
  action: AVGCreatorAction
) {
  switch (action.type) {
    case AVGCreatorActionType.OpenSettingPanel:
      return { ...state, isSettingPanelOpen: true, isShowPanelHeader: true };
    case AVGCreatorActionType.CloseSettingPanel:
      return { ...state, isSettingPanelOpen: false, isShowPanelHeader: false };
    case AVGCreatorActionType.ToggleCreateProjectDialog:
      return { ...state, isCreateProjectDialogOpen: action.payload.open };
    case AVGCreatorActionType.CreateProject:
      const newProject = AVGProjectManager.createProject(
        action.payload.projectName,
        action.payload.description
      );

      const projects = state.projects.concat(newProject);
      return { ...state, projects };
    default:
      throw new Error();
  }
}
