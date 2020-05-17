/** @format */

import React from "react";
import "./App.less";

import { FocusStyleManager } from "@blueprintjs/core";
FocusStyleManager.onlyShowFocusOnTabs();

import AVGCreator from "./pages/AVGCreator";
import { AppInit } from "./services/app-init";

AppInit.start();

const App: React.FC = () => {
  return <AVGCreator />;
};

export default App;
