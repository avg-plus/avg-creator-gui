/** @format */

import React from "react";
import "./App.less";
import { Titlebar, Color } from "custom-electron-titlebar";

import { Env } from "../common/env";
import "../common/lib/logger";

import ScriptEditor from "./pages/script-editor";

if (Env.getOSName() === "Windows") {
    new Titlebar({
        titleHorizontalAlignment: "left",
        maximizable: true,
        minimizable: true,
        closeable: true,
        backgroundColor: Color.fromHex("#AA3029")
    });
}

const EditorApp: React.FC = () => {
    return <ScriptEditor />;
};

export default EditorApp;
