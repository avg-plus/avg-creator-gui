import {
  AVGCreatorActionType,
  AVGCreatorAction
} from "./../actions/avg-creator-actions";
import {
  AVGProjectData,
  AVGProjectManager
} from "../../manager/project-manager";

export interface IAVGServer {
  serverProject: AVGProjectData | null;
  isRunning: boolean;
}

export interface IAVGCreatorInitialState {
  isSettingPanelOpen: boolean;
  isShowPanelHeader: boolean;
  isCreateProjectDialogOpen: boolean;
  isSetWorkspaceDialogOpen: boolean;
  projects: AVGProjectData[];
  selectedProjectItem: AVGProjectData | null;
  currentServer: IAVGServer;
}

export const AVGCreatorInitialState: IAVGCreatorInitialState = {
  isSettingPanelOpen: true,
  isShowPanelHeader: false,
  isCreateProjectDialogOpen: false,
  isSetWorkspaceDialogOpen: false,
  projects: [],
  selectedProjectItem: null,
  currentServer: {
    serverProject: null,
    isRunning: false
  }
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
    case AVGCreatorActionType.ToggleSetWorkspaceDialog:
      return { ...state, isSetWorkspaceDialogOpen: action.payload.open };
    case AVGCreatorActionType.SetProjectList:
      return { ...state, projects: action.payload.projects };
    case AVGCreatorActionType.AddProjectItem:
      return {
        ...state,
        selectedProjectItem: null,
        projects: state.projects.concat(action.payload.project)
      };
    case AVGCreatorActionType.SelectProjectItem:
      return { ...state, selectedProjectItem: action.payload.project };
    case AVGCreatorActionType.RemoveProjectItem:
      const projects = state.projects.filter((v) => {
        return v._id !== action.payload.projectID;
      });

      return {
        ...state,
        projects
      };
    case AVGCreatorActionType.StartServer: {
      return {
        ...state,
        currentServer: {
          serverProject: action.payload.serverProject,
          isRunning: action.payload.isRunning
        }
      };
    }

    default:
      throw new Error();
  }
}
