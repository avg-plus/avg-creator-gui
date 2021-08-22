import React from "react";
import { useMount } from "react-use";

import { delayExecution } from "../../../common/utils";

import "./avg-workspace.less";

import { StoryManager } from "../../../common/services/story-manager";
import { Codegen } from "../../../common/services/storyboard/codegen";
import { GUIWorkspaceService, LayoutPanelID } from "./avg-workspace.service";
import { Mosaic, MosaicWindow } from "react-mosaic-component";
import { ResourceTreeView } from "./views/resource-tree-view/resource-tree-view";
import { RendererApplication } from "../../../common/services/renderer-application";
import { VisualStoryEditor } from "./views/visual-story-editor/visual-story-editor";

export const AVGWorkspace = () => {
  useMount(() => {
    delayExecution(() => {
      StoryManager.init();
      Codegen.init();
    }, 0);
  });

  const layoutMap = GUIWorkspaceService.layout;

  const renderView = (id: LayoutPanelID) => {
    switch (id) {
      case "StoryTree": {
        return <ResourceTreeView></ResourceTreeView>;
      }
      case "StoryBoard": {
        return <VisualStoryEditor></VisualStoryEditor>;
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
            direction: "column",
            first: "StoryBoard",
            second: "PropertyView"
          }
        }}
      />
    </div>
  );
};
