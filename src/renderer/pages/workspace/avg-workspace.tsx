import React from "react";
import { useMount } from "react-use";
import $ from "jquery";

import { delayExecution } from "../../../common/utils";

import "./avg-workspace.less";

import { Codegen } from "../../../common/services/storyboard/codegen";
import { GUIWorkspaceService, LayoutPanelID } from "./avg-workspace.service";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { _DevelopmentDebugView } from "./views/_debug-view";
import { FileTreeView } from "./views/file-tree/file-tree.view";
import { AVGProject } from "../../modules/context/project";
import { DocumentTabs } from "./views/document-tabs/document-tabs.view";

interface AVGWorkspaceProps {
  project: AVGProject;
}

export const AVGWorkspace = (props: AVGWorkspaceProps) => {
  useMount(async () => {
    console.log();

    // 把所有设为了 __NO_TOOLBAR__ 的工具栏移除掉
    $(`.mosaic-window-toolbar div[title="__NO_TOOLBAR__"]`).parent().remove();
  });

  const layoutMap = GUIWorkspaceService.layout;

  const renderView = (id: LayoutPanelID) => {
    switch (id) {
      case "StoryTree": {
        return <FileTreeView project={props.project}></FileTreeView>;
      }
      case "StoryBoard": {
        return <DocumentTabs project={props.project}></DocumentTabs>;
      }
      case "DebugView": {
        return <_DevelopmentDebugView></_DevelopmentDebugView>;
      }
    }

    return <></>;
  };

  return (
    <div id="workspace-container">
      <Mosaic<LayoutPanelID>
        renderTile={(id, path) => (
          <MosaicWindow<LayoutPanelID>
            path={path}
            draggable={false}
            createNode={() => "StoryTree"}
            toolbarControls={<></>}
            title={layoutMap[id].title}
          >
            {renderView(id)}
          </MosaicWindow>
        )}
        initialValue={{
          direction: "row",
          first: "StoryTree",
          splitPercentage: 15,
          second: {
            direction: "row",
            first: {
              direction: "column",
              first: "StoryBoard",
              splitPercentage: 80,
              second: "PropertyView"
            },
            splitPercentage: 80,
            second: "DebugView"
          }
        }}
      />
    </div>
  );
};
