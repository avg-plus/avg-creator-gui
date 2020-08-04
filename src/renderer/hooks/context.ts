import React from "react";
import {
  IAVGCreatorInitialState,
  AVGCreatorInitialState
} from "../redux/reducers/avg-creator-reducers";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";

type DispatchData = {
  type: AVGCreatorActionType;
  payload: any;
};

export const CreatorContext = React.createContext<{
  state: IAVGCreatorInitialState;
  dispatch: (s?: DispatchData) => void;
}>({
  state: AVGCreatorInitialState,
  dispatch: () => {}
});
