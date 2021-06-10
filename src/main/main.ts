import os from "os";
import { BrowserWindow, app, Menu } from "electron";
import isDev from "electron-is-dev";

process.env.NODE_ENV = isDev ? "development" : "production";

import path from "path";

app.commandLine.appendSwitch("in-process-gpu");

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, "preload.js"),
      allowRunningInsecureContent: false
    }
  });

  // Mac 下开发模式下设置个图标，就是看着好看
  if (isDev && os.platform() === "darwin") {
    app.dock.setIcon("pack-data/icons/icon_512x512@2x.png");
  }

  Menu.setApplicationMenu(null);

  mainWindow.loadFile("./dist/static/index.html");
});

app.on("window-all-closed", app.quit);
