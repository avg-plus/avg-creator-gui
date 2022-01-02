import Cropper from "cropperjs";
import * as dat from "dat.gui";

import React, { useEffect, useState } from "react";
import { GlobalEvents } from "../../../../common/global-events";
import { autoSubScribe } from "../../../../common/utils";
import { WorkspaceDebugUI } from "../../../../common/services/workspace-debug-ui";

import "./_debug-view.less";
import { useMount } from "react-use";
import { APICharacterBlockService } from "./visual-story-editor/plugins/character/character.service";
import { APICharacterData } from "../../../../common/models/character";
import { AVGProjectBuilder } from "../../../modules/compilers/builder";
import { WorkspaceContext } from "../../../modules/context/workspace-context";
import { StoryDocumentTab } from "./document-tabs/document-tabs.service";

export const _DevelopmentDebugView = () => {
  useMount(() => {
    const currentProject = WorkspaceContext.getCurrentProject();

    const gui = new dat.GUI({ name: "My GUI" });

    const editorDebugFolder = gui.addFolder("编辑器调试");

    var characterDebugFolder = gui.addFolder("角色相关工具");
    characterDebugFolder.domElement.appendChild(
      document.getElementById("character-crop-preview")!
    );
    characterDebugFolder.open();

    /**
     * 引擎调试
     */

    const engineDebug = {
      编译: async () => {
        // await Codegen.run();
        AVGProjectBuilder.build();
      },
      打印当前脚本: () => {},
      运行游戏: () => {}
    };

    const runtimeFolder = gui.addFolder("引擎调试");
    runtimeFolder.add(engineDebug, "编译");
    runtimeFolder.add(engineDebug, "打印当前脚本");
    runtimeFolder.add(engineDebug, "运行游戏");
    runtimeFolder.open();

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

        const project = WorkspaceContext.getCurrentProject();
        const service = project.getDocumentTabsService();
        const editorService = (service.getActiveTab() as StoryDocumentTab)
          .editorService;

        const block =
          editorService.getCurrentFocusBlock() as APICharacterBlockService;

        console.log("block", block);

        if (block && block.setCharacterData) {
          const data = new APICharacterData();
          data.character_id = "test-id-" + Date.now();
          data.thumbnailData = dataURL;
          data.avatarPath = `${currentProject.getDir(
            "root"
          )}\\resources\\characters\\1.png`;
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
      ></img>
    </div>
  );
};
