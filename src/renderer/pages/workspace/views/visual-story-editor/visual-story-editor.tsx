import React from "react";
import { useMount } from "react-use";
import { GUIVisualStoryEditorService } from "./visual-story-editor.service";

import "./visual-story-editor.less";

import { AVGProject } from "../../../../modules/context/project";
import { DocumentTabs } from "../document-tabs/document-tabs.view";

interface VisualStoryEditorProps {
  project: AVGProject;
}

export const VisualStoryEditor = (props: VisualStoryEditorProps) => {
  useMount(() => {
    // GUIVisualStoryEditorService.init();
  });

  return <>{/* <DocumentTabs project={props.project}></DocumentTabs> */}</>;
};
