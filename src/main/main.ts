import os from "os";
import { BrowserWindow, app, Menu } from "electron";
import isDev from "electron-is-dev";

process.env.NODE_ENV = isDev ? "development" : "production";

import path from "path";

app.commandLine.appendSwitch("in-process-gpu");

const WIDTH = 860;
const HEIGHT = 640;
app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
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

  mainWindow.loadFile("./dist/static/project-browser.index.html");
});

app.on("window-all-closed", app.quit);
