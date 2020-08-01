/** @format */

import React from "react";
import "./app.less";

import "../common/env";
import "../common/lib/logger";

import { AppInit } from "./services/app-init";
AppInit.start();

import AVGCreator from "./pages/avg-creator";
const App: React.FC = () => {
  return <AVGCreator />;
};

export default App;
