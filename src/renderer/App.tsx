/** @format */

import React from "react";
import "./App.less";

import { FocusStyleManager } from "@blueprintjs/core";
FocusStyleManager.onlyShowFocusOnTabs();

import AVGCreator from "./pages/AVGCreator";

const App: React.FC = () => {
  return <AVGCreator />;
};

export default App;
