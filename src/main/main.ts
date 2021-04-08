import os from "os";
import { BrowserWindow, app, Menu } from "electron";
import isDev from "electron-is-dev";

process.env.NODE_ENV = isDev ? "development" : "production";

import path from "path";

app.commandLine.appendSwitch("in-process-gpu");

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    width: 460,
    height: 680,
    minWidth: 400,
    minHeight: 680,
    maxWidth: 600,
    maxHeight: 800,
    frame: false,
    show: false,
    transparent: true,
    thickFrame: false,
    center: true,
    hasShadow: true,
    resizable: true,
    titleBarStyle: "hiddenInset",
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

  mainWindow.webContents.once("dom-ready", () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.once("ready-to-show", () => {});

  mainWindow.loadFile("./dist/static/index.html");
  // mainWindow.loadFile("./dist/static/project-manager.index.html");
});

app.on("window-all-closed", app.quit);
