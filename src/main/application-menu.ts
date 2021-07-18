import { app, Menu, MenuItem } from "electron";
import { GlobalEvents } from "../common/global-events";
import ipcObservableMain from "../common/ipc-observable/ipc-observable-main";
import Env from "./remote/env";



export class ApplicationMenu {

  static update() {

    const templates = [
      ...this.buildSystemMenus(),
      ...this.buildDevelopmentMenus()
    ] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[]

    Menu.setApplicationMenu(Menu.buildFromTemplate(templates))
  }

  static buildDevelopmentMenus() {
    return [
      {
        id: "debugging-tools",
        commandId: 0,
        label: "开发和调试工具",
        submenu: [
          {
            id: 'open-resource-manager',
            label: "打开资源管理器",
            enabled: true,
            click: async (item, browserWindow) => {
              ipcObservableMain.broadcast(GlobalEvents.Menu_OnResourceManager, {
                item, browserWindow
              })
            }
          }
        ]
      }
    ] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[];
  }

  static buildSystemMenus() {

    if (Env.getOSName() === "MacOS") {
      const menus = [{
        label: "",
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] as (Electron.MenuItemConstructorOptions | Electron.MenuItem)[];

      return menus;
    }

    return []
  }

}