import os from "os";
import { BrowserWindow, app, Menu } from "electron";
import isDev from "electron-is-dev";

process.env.NODE_ENV = isDev ? "development" : "production";

import path from "path";

app.commandLine.appendSwitch("in-process-gpu");

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    minWidth: 400,
    minHeight: 680,
    frame: false,
    transparent: true,
    thickFrame: false,
    width: 1280,
    height: 760,
    show: false,
    center: true,
    hasShadow: true,
    resizable: true,
    titleBarStyle: "hidden",
    title: "AVG Workspace",
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

  mainWindow.loadFile("./dist/static/workspace.index.html");
});

app.on("window-all-closed", app.quit);
