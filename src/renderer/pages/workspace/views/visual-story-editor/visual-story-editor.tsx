import React from "react";
import { useMount } from "react-use";
import { GUIVisualStoryEditorService } from "./visual-story-editor.service";

import "./visual-story-editor.less";

export const VisualStoryEditor = () => {
  useMount(() => {
    GUIVisualStoryEditorService.load();
  });

  return <div id="editorjs"></div>;
};
