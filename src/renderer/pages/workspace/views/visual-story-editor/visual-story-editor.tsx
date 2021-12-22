import React from "react";
import { useMount } from "react-use";
import { GUIVisualStoryEditorService } from "./visual-story-editor.service";

import "./visual-story-editor.less";

import { AVGProject } from "../../../../modules/context/project";
import Tabs, { Tab } from "react-awesome-tabs";

interface VisualStoryEditorProps {
  project: AVGProject;
}

export const VisualStoryEditor = (props: VisualStoryEditorProps) => {
  useMount(() => {
    GUIVisualStoryEditorService.init();
  });

  return (
    <>
      <Tabs active={0} onTabSwitch={() => {}} draggable={true} showAdd={false}>
        <Tab showClose={true} title="123123">
          <div id="editorjs"></div>
        </Tab>
        <Tab title="123123">bar</Tab>
        <Tab title="Tab3">baz</Tab>
      </Tabs>
    </>
  );
};
