import React, { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Tabs, { Tab } from "react-awesome-tabs";
import { AVGProject } from "../../../../modules/context/project";

import "./document-tabs.less";
import NState, { setDebug } from "nstate";
import { DocumentTab } from "./document-tabs.service";
import { GiBookCover } from "react-icons/gi";
import { MdTipsAndUpdates } from "react-icons/md";

setDebug(true); // enable debug log

export class DocumentTabsStore extends NState<{
  tabs: DocumentTab[];
  activeIndex: number;
}> {
  setTabList(list: DocumentTab[]) {
    this.setState((draft) => {
      draft.tabs = [...list];
    });
  }

  setActiveIndex(index: number) {
    this.setState(() => ({ activeIndex: index }));
  }
}

export const documentTabsStore = new DocumentTabsStore({
  tabs: [],
  activeIndex: 0
});

interface DocumentTabsProps {
  project: AVGProject;
}

export const DocumentTabs = (props: DocumentTabsProps) => {
  const tabs = documentTabsStore.useState((s) => s.tabs);
  const activeIndex = documentTabsStore.useState((s) => s.activeIndex);

  const renderTabs = () => {
    return tabs.map((v) => {
      return (
        <Tab
          key={nanoid()}
          showClose={v.closable}
          title={`  ${v.title}`}
          icon={
            v.type === "blank" ? (
              <MdTipsAndUpdates size={16} />
            ) : (
              <GiBookCover size={16} />
            )
          }
        >
          <div id="editorjs"></div>
        </Tab>
      );
    });
  };

  const onTabSwitch = (index: number) => {
    documentTabsStore.setActiveIndex(index);
  };

  return (
    <Tabs
      active={activeIndex}
      onTabSwitch={onTabSwitch}
      draggable={true}
      showAdd={false}
    >
      {renderTabs()}
    </Tabs>
  );
};
