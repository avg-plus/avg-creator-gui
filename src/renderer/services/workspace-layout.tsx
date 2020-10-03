import React from "react";
import { remote } from "electron";
import createClass from "create-react-class";

import $ from "jquery";

import { ElementQueries, ResizeSensor } from "css-element-queries";
ElementQueries.listen();

import GoldenLayout from "golden-layout";

import { StoryboardView } from "../pages/workspace/views/storyboard";
import { PropertyView } from "../pages/workspace/views/property-view";

export class WorkspaceLayout {
  static views = {
    storyboardView: <StoryboardView></StoryboardView>,
    propertyView: <PropertyView></PropertyView>
  };

  static launchWindow() {
    const editorWindow = new remote.BrowserWindow({
      width: 1280,
      height: 760,
      show: false,
      backgroundColor: "0",
      center: true,
      hasShadow: true,
      resizable: true,
      titleBarStyle: "hidden",
      title: "AVG Workspace",
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        allowRunningInsecureContent: false
      }
    });

    editorWindow.loadFile("./dist/static/workspace.index.html");
    editorWindow.webContents.openDevTools();
    editorWindow.maximize();
    editorWindow.on("ready-to-show", () => {
      editorWindow.show();
    });
  }

  static initLayout() {
    const workspaceContainer = $("#workspace-container");

    const layout = new GoldenLayout(
      {
        settings: {
          showPopoutIcon: false,
          showMaximiseIcon: false,
          hasHeaders: true,
          constrainDragToContainer: true,
          reorderEnabled: true,
          selectionEnabled: false,
          popoutWholeStack: false,
          blockedPopoutsThrowError: true,
          closePopoutsOnUnload: true,
          showCloseIcon: true
        },
        content: [
          {
            type: "row",
            content: [
              {
                type: "react-component",
                component: "propertyView",
                isClosable: false,
                title: "资源管理器",
                width: 20
              },
              {
                type: "column",
                content: [
                  {
                    type: "react-component",
                    component: "storyboardView",
                    title: "剧本创作",
                    isClosable: false
                  },
                  {
                    type: "react-component",
                    component: "propertyView",
                    title: "属性",
                    isClosable: false,
                    height: 30
                  }
                ]
              },
              {
                type: "react-component",
                component: "propertyView",
                title: "实时预览",
                isClosable: false
              }
            ]
          }
        ]
      },
      workspaceContainer
    );

    if (workspaceContainer) {
      new ResizeSensor(workspaceContainer.get(0), () => {
        layout.updateSize(window.innerWidth, window.innerHeight);
      });
    }

    Object.keys(this.views).forEach((v) => {
      layout.registerComponent(
        v,
        createClass({
          render: () => {
            return this.views[v];
          }
        })
      );
    });

    layout.init();

    const splitter = $(".lm_splitter");

    layout._$calculateItemAreas();

    splitter.on("mousemove", () => {
      console.log("draging");
    });

    return layout;
  }
}
