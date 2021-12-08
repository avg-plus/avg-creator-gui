import React from "react";
import { useMount } from "react-use";

import { delayExecution } from "../../../common/utils";

import "./avg-workspace.less";

import { Codegen } from "../../../common/services/storyboard/codegen";
import { GUIWorkspaceService, LayoutPanelID } from "./avg-workspace.service";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { RendererApplication } from "../../../common/services/renderer-application";
import { VisualStoryEditor } from "./views/visual-story-editor/visual-story-editor";
import { _DevelopmentDebugView } from "./views/_debug-view";
import { FileTreeView } from "./views/file-tree/file-tree.view";

export const AVGWorkspace = () => {
  useMount(() => {
    delayExecution(() => {
      Codegen.init();
    }, 0);
  });

  const layoutMap = GUIWorkspaceService.layout;

  const renderView = (id: LayoutPanelID) => {
    switch (id) {
      case "StoryTree": {
        return <FileTreeView></FileTreeView>;
      }
      case "StoryBoard": {
        return <VisualStoryEditor></VisualStoryEditor>;
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
          second: {
            // direction: "column",
            direction: "row",
            first: "DebugView",
            second: {
              direction: "column",
              first: "StoryBoard",
              second: "PropertyView"
            },
            splitPercentage: 20
          },
          splitPercentage: 10
        }}
      />
    </div>
  );
};
