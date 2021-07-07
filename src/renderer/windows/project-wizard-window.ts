import { WindowIDs } from "../../common/window-ids";
import { AVGWindow } from "./gui-window";

const WIDTH = 840;
const HEIGHT = 500;

interface GUIProjectWizardWindowParams {}

export class GUIProjectWizardWindow extends AVGWindow {
  constructor() {
    super(WindowIDs.ProjectWizardWindow, "project-wizard.index.html", {
      autoShow: false,
      singleton: true,
      destroyOnClosed: false,
      browserWindowOptions: {
        minWidth: WIDTH,
        minHeight: HEIGHT,
        frame: false,
        transparent: false,
        thickFrame: false,
        minimizable: false,
        maximizable: false,
        width: WIDTH,
        modal: true,
        height: HEIGHT,
        show: false,
        center: true,
        hasShadow: true,
        closable: true,
        resizable: false,
        // titleBarStyle: "hidden",
        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: false,
          allowRunningInsecureContent: false
        }
      }
    });
  }
}

export const ProjectWizardWindow = new GUIProjectWizardWindow();
