import {
  AVGCreatorActionType,
  AVGCreatorAction
} from "./../actions/avg-creator-actions";
import {
  AVGProjectData,
  AVGProjectManager
} from "../../manager/project-manager";
import { UpdateItemConfig } from "../../services/autoupdater";

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
  isAboutDialogOpen: boolean;
  isProjectDetailDialogOpen: boolean;
  isSetWorkspaceDialogOpen: boolean;
  checkUpdateAlert: {
    open: boolean;
    updateItem: UpdateItemConfig | null;
  };
  silentUpdateAvailable: boolean;
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
  isAboutDialogOpen: false,
  isProjectDetailDialogOpen: false,
  isSetWorkspaceDialogOpen: false,
  checkUpdateAlert: {
    open: false,
    updateItem: null
  },
  silentUpdateAvailable: false,
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
): IAVGCreatorInitialState {
  const payload = action.payload;
  switch (action.type) {
    case AVGCreatorActionType.OpenSettingPanel:
      return { ...state, isSettingPanelOpen: true, isShowPanelHeader: true };
    case AVGCreatorActionType.CloseSettingPanel:
      return { ...state, isSettingPanelOpen: false, isShowPanelHeader: false };
    case AVGCreatorActionType.ToggleCreateProjectDialog:
      return { ...state, isCreateProjectDialogOpen: payload.open };
    case AVGCreatorActionType.OpenProjectDetailDialog:
      return {
        ...state,
        isProjectDetailDialogOpen: payload.open,
        openedProject: payload.project
      };
    case AVGCreatorActionType.OpenAboutDialog:
      return {
        ...state,
        isAboutDialogOpen: payload.open
      };
    case AVGCreatorActionType.CheckUpdateAlert:
      return {
        ...state,
        checkUpdateAlert: {
          open: payload.open,
          updateItem: payload.updateItem
        }
      };
    case AVGCreatorActionType.ToggleSetWorkspaceDialog:
      return { ...state, isSetWorkspaceDialogOpen: payload.open };
    case AVGCreatorActionType.SetProjectList:
      return { ...state, projects: payload.projects };
    case AVGCreatorActionType.AddProjectItem:
      return {
        ...state,
        projects: state.projects.concat(payload.project)
      };
    case AVGCreatorActionType.RemoveProjectItem:
      const projects = state.projects.filter((v) => {
        return v._id !== payload.projectID;
      });

      return {
        ...state,
        projects
      };
    case AVGCreatorActionType.StartServer: {
      return {
        ...state,
        currentServer: {
          serveProject: payload.serverProject,
          isRunning: payload.isRunning,
          engineURL: "",
          assetsURL: ""
        }
      };
    }
    case AVGCreatorActionType.LaunchGame: {
      return {
        ...state,
        currentDesktopProcess: {
          PID: payload.PID,
          status: payload.status
        }
      };
    }
    case AVGCreatorActionType.SetDefaultEngine: {
      return {
        ...state,
        defaultEngineBundleHash: payload.bundleHash
      };
    }
    default:
      throw new Error();
  }
}
