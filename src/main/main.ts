import { format } from "url";
import { BrowserWindow, app } from "electron";
import isDev from "electron-is-dev";
import { resolve } from "app-root-path";

import "./ipc";
import path from "path";

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 460,
    height: 680,
    minWidth: 400,
    minHeight: 480,
    frame: false,
    thickFrame: false,
    center: true,
    resizable: true,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      allowRunningInsecureContent: true
    }
  });

  mainWindow.hide();
  if (isDev) {
    app.dock.setIcon("tools/icons/icon_512x512@2x.png");
  }

  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      mainWindow.show();
    }, 500);
    if (isDev) {
      // mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile("./dist/static/index.html");
});

app.on("window-all-closed", app.quit);
