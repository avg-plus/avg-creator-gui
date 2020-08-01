/** @format */

import React from "react";
import "./app.less";
import { Titlebar, Color } from "custom-electron-titlebar";

import { Env } from "../common/env";
import "../common/lib/logger";

import { AppInit } from "./services/app-init";
AppInit.start();

import AVGCreator from "./pages/avg-creator";

if (Env.getOSName() === "Windows") {
  new Titlebar({
    maximizable: true,
    minimizable: true,
    closeable: true,
    backgroundColor: Color.fromHex("#AA3029")
  });
}

const App: React.FC = () => {
  return <AVGCreator />;
};

export default App;
