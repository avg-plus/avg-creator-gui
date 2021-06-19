import { WindowIDs } from "../../common/window-ids";
import { AVGWindow } from "./gui-window";

const WIDTH = 860;
const HEIGHT = 640;

interface GUIWorkspaceWindowParams {
  project_dir: string;
}

export class GUIWorkspaceWindow extends AVGWindow<GUIWorkspaceWindowParams> {
  constructor() {
    super(WindowIDs.WorkspaceWindow, "workspace.index.html", {
      autoShow: true,
      singleton: true,
      browserWindowOptions: {
        frame: false,
        transparent: false,
        thickFrame: false,
        show: false,
        center: true,
        hasShadow: true,
        resizable: true,
        titleBarStyle: "hidden"
      }
    });
  }
}

export const WorkspaceWindow = new GUIWorkspaceWindow();
