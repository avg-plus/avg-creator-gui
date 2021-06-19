import { WindowIDs } from "../../common/window-ids";
import { AVGWindow } from "./gui-window";

const WIDTH = 860;
const HEIGHT = 640;

interface GUIProjectWizardWindowParams {}

export class GUIProjectWizardWindow extends AVGWindow<GUIProjectWizardWindowParams> {
  constructor() {
    super(WindowIDs.ProjectWizardWindow, "project-wizard.index.html", {
      autoShow: true,
      singleton: true,
      browserWindowOptions: {
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
        closable: true,
        resizable: false,
        titleBarStyle: "hidden",
        webPreferences: {
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          allowRunningInsecureContent: false
        }
      }
    });
  }
}

export const ProjectWizardWindow = new GUIProjectWizardWindow();
