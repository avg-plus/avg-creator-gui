import { BrowserWindowConstructorOptions } from "electron";
import { WindowIDs } from "../common/window-ids";
import { AVGWindow } from "./gui-window";

const WIDTH = 860;
const HEIGHT = 640;

export class GUIWorkspaceWindow extends AVGWindow {
  constructor() {
    super(WindowIDs.WorkspaceWindow, "workspace.index.html", {
      frame: false,
      transparent: false,
      thickFrame: false,
      show: false,
      center: true,
      hasShadow: true,
      resizable: false,
      titleBarStyle: "hidden"
    });
  }
}

export const WorkspaceWindow = new GUIWorkspaceWindow();
