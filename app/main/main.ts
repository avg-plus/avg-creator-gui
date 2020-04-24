import { format } from 'url'

import { BrowserWindow, app } from 'electron'
import isDev from 'electron-is-dev';
import { resolve } from 'app-root-path'

app.on('ready', async () => {
  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 400,
    height: 680,
    minWidth: 400,
    minHeight: 480,
    frame: true,
    thickFrame: false,
    resizable: true,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      enableRemoteModule: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (isDev) { mainWindow.webContents.openDevTools() }
  })

  const devPath = 'http://localhost:1124'
  const prodPath = format({
    pathname: resolve('app/renderer/.parcel/production/index.html'),
    protocol: 'file:',
    slashes: true
  })
  const url = isDev ? devPath : prodPath

  mainWindow.setMenu(null)
  mainWindow.loadURL(url)
})

app.on('window-all-closed', app.quit)
