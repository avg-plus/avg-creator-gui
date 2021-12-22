import React, { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Tabs, { Tab } from "react-awesome-tabs";
import { AVGProject } from "../../../../modules/context/project";

import "./document-tabs.less";
import { DocumentTab } from "./document-tabs.service";

interface DocumentTabsProps {
  project: AVGProject;
}

export const DocumentTabs = (props: DocumentTabsProps) => {
  const service = props.project.getDocumentTabsService();
  const allTabs = service.getTabs();

  const [tabs, setTabs] = useState<DocumentTab[]>([]);

  useEffect(() => {
    setTabs(allTabs);
  }, [tabs]);

  const renderTabs = () => {
    return tabs.map((v) => {
      return (
        <Tab key={nanoid()} showClose={v.closable} title={v.title}>
          <div id="editorjs"></div>
        </Tab>
      );
    });
  };

  return (
    <Tabs active={0} onTabSwitch={() => {}} draggable={true} showAdd={false}>
      {renderTabs()}
      {/* <Tab showClose={true} title="123123">
        <div id="editorjs"></div>
      </Tab>
      <Tab title="123123">bar</Tab>
      <Tab title="Tab3">baz</Tab> */}
    </Tabs>
  );
};
