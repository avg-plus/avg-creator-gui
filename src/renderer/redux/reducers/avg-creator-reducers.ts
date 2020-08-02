import {
  AVGCreatorActionType,
  AVGCreatorAction
} from "./../actions/avg-creator-actions";
import {
  AVGProjectData,
  AVGProjectManager
} from "../../manager/project-manager";

export interface IAVGServer {
  serveProject: AVGProjectData | null;
  engineURL: string;
  assetsURL: string;
  isRunning: boolean;
}

export interface IAVGCreatorInitialState {
  isSettingPanelOpen: boolean;
  isShowPanelHeader: boolean;
  isCreateProjectDialogOpen: boolean;
  isProjectDetailDialogOpen: boolean;
  isSetWorkspaceDialogOpen: boolean;
  projects: AVGProjectData[];
  openedProject: AVGProjectData | null;
  currentServer: IAVGServer;
  currentDesktopProcess: {
    status: "normal" | "closed";
    PID: number;
  };
  defaultEngineBundleHash: string;
}

export const AVGCreatorInitialState: IAVGCreatorInitialState = {
  isSettingPanelOpen: true,
  isShowPanelHeader: false,
  isCreateProjectDialogOpen: false,
  isProjectDetailDialogOpen: false,
  isSetWorkspaceDialogOpen: false,
  projects: [],
  openedProject: null,
  currentServer: {
    serveProject: null,
    engineURL: "",
    assetsURL: "",
    isRunning: false
  },
  currentDesktopProcess: {
    status: "closed",
    PID: 0
  },
  defaultEngineBundleHash: ""
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
    case AVGCreatorActionType.OpenProjectDetailDialog:
      return {
        ...state,
        isProjectDetailDialogOpen: action.payload.open,
        openedProject: action.payload.project
      };
    case AVGCreatorActionType.ToggleSetWorkspaceDialog:
      return { ...state, isSetWorkspaceDialogOpen: action.payload.open };
    case AVGCreatorActionType.SetProjectList:
      return { ...state, projects: action.payload.projects };
    case AVGCreatorActionType.AddProjectItem:
      return {
        ...state,
        projects: state.projects.concat(action.payload.project)
      };
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
    case AVGCreatorActionType.LaunchGame: {
      return {
        ...state,
        currentDesktopProcess: {
          PID: action.payload.PID,
          status: action.payload.status
        }
      };
    }
    case AVGCreatorActionType.SetDefaultEngine: {
      return {
        ...state,
        defaultEngineBundleHash: action.payload.bundleHash
      };
    }
    default:
      throw new Error();
  }
}
