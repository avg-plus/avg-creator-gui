import os from "os";
import { BrowserWindow, app, Menu } from "electron";
import isDev from "electron-is-dev";

process.env.NODE_ENV = isDev ? "development" : "production";

import "./ipc";
import path from "path";
import { AutoUpdater } from "../renderer/services/autoupdater";

app.commandLine.appendSwitch("in-process-gpu");

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 460,
    height: 680,
    minWidth: 400,
    minHeight: 480,
    maxWidth: 600,
    maxHeight: 800,
    frame: false,
    show: false,
    transparent: true,
    thickFrame: false,
    center: true,
    resizable: true,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true,
      // preload: path.join(__dirname, "preload.js"),
      allowRunningInsecureContent: false
    }
  });

  // Mac 下开发模式下设置个图标，就是看着好看
  if (isDev && os.platform() === "darwin") {
    app.dock.setIcon("tools/icons/icon_512x512@2x.png");
  }

  Menu.setApplicationMenu(null);
  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      mainWindow.show();
    }, 500);
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.loadFile("./dist/static/index.html");
});

app.on("window-all-closed", app.quit);
