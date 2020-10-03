import React from "react";
import {
  IAVGCreatorInitialState,
  AVGCreatorInitialState
} from "../redux/reducers/avg-creator-reducers";
import {
  AVGCreatorAction,
  AVGCreatorActionType
} from "../redux/actions/avg-creator-actions";

type DispatchData = {
  type: AVGCreatorActionType;
  payload: any;
};

export const CreatorContext = React.createContext<{
  state: IAVGCreatorInitialState;
  dispatch: React.Dispatch<AVGCreatorAction>; // (s?: DispatchData) => void;
}>({
  state: AVGCreatorInitialState,
  dispatch: () => {}
});
