import { BrowserWindowConstructorOptions } from "electron";
import { AVGWindow } from "./gui-window";

const WIDTH = 860;
const HEIGHT = 640;

class GUIWorkspaceWindow extends AVGWindow {
  constructor() {
    super("workspace.index.html", {
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
