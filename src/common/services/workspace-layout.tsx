// import React from "react";
// import { ipcMain, remote } from "electron";
// import createClass from "create-react-class";

// import $ from "jquery";

// import { ElementQueries, ResizeSensor } from "css-element-queries";
// ElementQueries.listen();

// import GoldenLayout from "golden-layout";

// import { PropertyView } from "../../renderer/pages/workspace/views/property-view";
// import { ResourceTreeView } from "../../renderer/pages/workspace/views/resource-tree-view/resource-tree-view";
// // import { _DevelopmentDebugView } from "../../renderer/pages/workspace/views/_debug-view";
// import _ from "underscore";
// import { StoryboardView } from "../../renderer/pages/workspace/views/storyboard-view/storyboard-view";

// export class WorkspaceLayout {
//   static views = {
//     storyboardView: <StoryboardView></StoryboardView>,
//     propertyView: <PropertyView></PropertyView>,
//     resourceTreeView: <ResourceTreeView></ResourceTreeView>
//     // _debugView: <_DevelopmentDebugView></_DevelopmentDebugView>
//   };

//   static launchWindow(projectDir: string) {
//     const editorWindow = new remote.BrowserWindow({
//       width: 1280,
//       height: 760,
//       show: false,
//       center: true,
//       hasShadow: true,
//       resizable: true,
//       titleBarStyle: "hidden",
//       title: "AVG Workspace",
//       webPreferences: {
//         nodeIntegration: true,
//         nodeIntegrationInWorker: true,
//         allowRunningInsecureContent: false
//       }
//     });

//     editorWindow.loadFile("./dist/static/workspace.index.html");
//     editorWindow.webContents.openDevTools();
//     // editorWindow.on("ready-to-show", () => {
//     //   // 发送项目数据
//     //   editorWindow.webContents.send("InitAVGProject", {
//     //     ...project
//     //   });

//     //   editorWindow.show();
//     // });
//   }

//   static initLayout() {
//     const workspaceContainer = $("#workspace-container");

//     const layout = new GoldenLayout(
//       {
//         settings: {
//           showPopoutIcon: false,
//           showMaximiseIcon: false,
//           hasHeaders: true,
//           constrainDragToContainer: true,
//           reorderEnabled: true,
//           selectionEnabled: false,
//           popoutWholeStack: false,
//           blockedPopoutsThrowError: true,
//           closePopoutsOnUnload: true,
//           showCloseIcon: true
//         },
//         dimensions: {
//           headerHeight: 20,
//           borderWidth: 3,
//           minItemWidth: 100
//         },
//         content: [
//           {
//             type: "row",

//             content: [
//               {
//                 type: "react-component",
//                 component: "resourceTreeView",
//                 isClosable: false,
//                 title: "故事管理",
//                 width: 20
//               },
//               // {
//               //   type: "react-component",
//               //   component: "_debugView",
//               //   isClosable: false,
//               //   title: "* 调试面板",
//               //   width: 20
//               // },
//               {
//                 type: "column",
//                 content: [
//                   {
//                     type: "react-component",
//                     component: "storyboardView",
//                     title: "剧本创作",
//                     isClosable: false
//                   }
//                   // {
//                   //   type: "react-component",
//                   //   component: "propertyView",
//                   //   title: "属性",
//                   //   isClosable: false,
//                   //   height: 30
//                   // }
//                 ]
//               }
//               // {
//               //   type: "react-component",
//               //   component: "propertyView",
//               //   title: "实时预览",
//               //   isClosable: false
//               // }
//             ]
//           }
//         ]
//       },
//       workspaceContainer
//     );

//     if (workspaceContainer) {
//       const update = () => {
//         requestAnimationFrame(() => {
//           layout.updateSize(window.innerWidth, window.innerHeight);
//           update();
//         });
//       };

//       const debounceUpdate = _.debounce(update, 1);
//       debounceUpdate();
//     }

//     Object.keys(this.views).forEach((v) => {
//       layout.registerComponent(
//         v,
//         createClass({
//           render: () => {
//             return this.views[v];
//           }
//         })
//       );
//     });

//     layout.init();

//     return layout;
//   }
// }
