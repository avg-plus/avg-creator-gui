import { AVGWindow } from "./gui-window";

const WIDTH = 860;
const HEIGHT = 640;

class GUIProjectBrowserWindow extends AVGWindow {
  constructor() {
    super("project-browser.index.html", {
      minWidth: WIDTH,
      minHeight: HEIGHT,
      frame: false,
      transparent: false,
      thickFrame: false,
      width: WIDTH,
      height: HEIGHT,
      show: false,
      center: true,
      hasShadow: true,
      resizable: false,
      titleBarStyle: "hidden",
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        allowRunningInsecureContent: false
      }
    });
  }
}

export const ProjectBrowserWindow = new GUIProjectBrowserWindow();
