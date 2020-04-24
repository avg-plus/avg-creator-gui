import { AVGCreatorActionType } from "./../actions/avg-creator-actions";

interface IAVGCreatorInitialState {
  isSettingPanelOpen: boolean;
  isShowPanelHeader: boolean;
  projects: any[];
}

export const AVGCreatorInitialState: IAVGCreatorInitialState = {
  isSettingPanelOpen: true,
  isShowPanelHeader: false,
  projects: [
    {
      key: "1",
      name: "白色相簿2",
      description: "明明是我先来……",
    }
  ]
};

export function AVGCreatorReducer(state: IAVGCreatorInitialState, action: AVGCreatorActionType) {
  switch (action) {
    case AVGCreatorActionType.OpenSettingPanel:
      return { ...state, isSettingPanelOpen: true, isShowPanelHeader: true };
    case AVGCreatorActionType.CloseSettingPanel:
      return { ...state, isSettingPanelOpen: false, isShowPanelHeader: false };
    default:
      throw new Error();
  }
}
