import Cropper from "cropperjs";
import * as dat from "dat.gui";

import { Button, InputGroup } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { GlobalEvents } from "../../../../common/global-events";
import { autoSubScribe } from "../../../../common/utils";
import { WorkspaceDebugUI } from "../../../../common/services/workspace-debug-ui";

import "./_debug-view.less";
import { useMount } from "react-use";
import { GUIVisualStoryEditorService } from "./visual-story-editor/visual-story-editor.service";
import { BlockAPI, OutputData } from "@editorjs/editorjs";
import { EditorBlockDocument } from "./visual-story-editor/editor-block-manager";
import { APICharacterBlockService } from "./visual-story-editor/plugins/character/character.service";
import { CharacterData } from "../../../../common/models/character";
import { AVGProject } from "../../../../common/services/project";
import { StoryFileData } from "../../../../common/services/file-reader/story-file-reader";

export const _DevelopmentDebugView = () => {
  const [components, setComponents] = useState(WorkspaceDebugUI.components);

  useEffect(() => {
    return autoSubScribe(
      GlobalEvents.DebugComponentsShouldRender,
      (event, data) => {
        setComponents(WorkspaceDebugUI.components);
      }
    );
  });

  useMount(() => {
    const storyData = {
      文件路径:
        "/Users/angrypowman/Workspace/Programming/Revisions/avg-plus/game-projects/马猴烧酒/stories/start.story",
      读取: () => {
        const project = new AVGProject();
        const data = project.openStory(storyData.文件路径);

        const editor = GUIVisualStoryEditorService.getEditor();
        editor.clear();

        // editor.blocks.insert(data.stories[0].type, data.stories[0].data);

        const stories = {
          version: data.meta.version,
          time: data.meta.time,
          blocks: data.stories
        } as OutputData;

        GUIVisualStoryEditorService.load(stories);
      },
      保存: async () => {
        const project = new AVGProject();

        const output = await GUIVisualStoryEditorService.getEditor().save();

        const saveData = {
          meta: {
            time: output.time,
            version: output.version
          },
          stories: []
        } as StoryFileData;

        saveData.stories = output.blocks.map((v) => {
          return {
            id: v.id!,
            type: v.type,
            data: v.data
          };
        });

        project.saveStory(storyData.文件路径, saveData);
      }
    };

    const gui = new dat.GUI({ name: "My GUI" });
    const storyDebugFolder = gui.addFolder("故事管理");
    storyDebugFolder.add(storyData, "文件路径");
    storyDebugFolder.add(storyData, "读取");
    storyDebugFolder.add(storyData, "保存");

    const editorDebugFolder = gui.addFolder("编辑器调试");

    var folder1 = gui.addFolder("角色相关工具");
    folder1.domElement.appendChild(
      document.getElementById("character-crop-preview")!
    );

    document.getElementById("dat-gui")!.appendChild(gui.domElement);

    gui.domElement.style.width = "100%";
    gui.domElement.style.height = "100%";

    // 初始化裁剪组件
    const image = document.getElementById(
      "character-crop-preview"
    ) as HTMLImageElement;

    const cropper = new Cropper(image, {
      aspectRatio: 4 / 3,
      viewMode: 1,
      crop(event) {
        console.log("crop event details: ", cropper!.getCropBoxData());

        const dataURL = cropper!.getCroppedCanvas().toDataURL();

        const block =
          EditorBlockDocument.getCurrentFocusBlock() as APICharacterBlockService;
        if (block && block.setCharacterData) {
          const data = new CharacterData();
          data.thumbnailData = dataURL;
          data.name = "林牧风";

          block.setCharacterData(data);

          localStorage.setItem("debug_cached_avatar", JSON.stringify(data));
        }
      }
    });
  });

  return (
    <div>
      <div id={"dat-gui"} style={{ width: "100%", height: "100%" }}></div>
      <img
        id={"character-crop-preview"}
        style={{
          display: "block",
          maxWidth: "100%"
        }}
        src={
          "/Users/angrypowman/Workspace/Programming/Revisions/avg-plus/game-projects/马猴烧酒/resources/characters/1.png"
        }
      ></img>

      {/* {components.map((v) => {
        return (
          <Button key={v.text} onClick={v.callback}>
            {v.text}
          </Button>
        );
      })}
    <hr></hr>*/}
    </div>
  );
};
