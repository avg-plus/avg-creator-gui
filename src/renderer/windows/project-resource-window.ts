import { WindowIDs } from "../../common/window-ids";
import { AVGWindow } from "./gui-window";

const WIDTH = 860;
const HEIGHT = 640;

interface GUIProjectResourceWindowParams {}

export class GUIProjectResourceWindow extends AVGWindow {
  constructor() {
    super(WindowIDs.ProjectResourceWindow, "project-resource.index.html", {
      browserWindowOptions: {
        frame: false,
        minWidth: WIDTH,
        minHeight: HEIGHT,
        height: HEIGHT
      }
    });
  }
}

export const ProjectResourceWindow = new GUIProjectResourceWindow();
