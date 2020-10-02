import { remote } from "electron";

export class WindowManager {
  static windows = {
    portal: {}
  };

  static launchEditorWindow() {
    const editorWindow = new remote.BrowserWindow({
      width: 460,
      height: 680,
      show: false,
      center: true,
      hasShadow: true,
      resizable: true,
      titleBarStyle: "hiddenInset",
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        allowRunningInsecureContent: false
      }
    });

    editorWindow.loadFile("./dist/static/workspace.index.html");
    editorWindow.show();
  }
}
