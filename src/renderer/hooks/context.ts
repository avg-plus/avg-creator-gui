import React from "react";
import {
  IAVGCreatorInitialState,
  AVGCreatorInitialState
} from "../redux/reducers/avg-creator-reducers";

export const CreatorContext = React.createContext<{
  state: IAVGCreatorInitialState;
  dispatch: any;
}>({
  state: AVGCreatorInitialState,
  dispatch: null
});
