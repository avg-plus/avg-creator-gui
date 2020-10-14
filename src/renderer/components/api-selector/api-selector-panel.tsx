import { Card, Elevation, Tab, TabId, Tabs } from "@blueprintjs/core";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import React from "react";
import { useState } from "react";

import "./api-selector-panel.less";

interface APISelectorButton {
  class: string;
  text: string;
}

export const APISelectorPanel = () => {
  const [buttons, setButtons] = useState<APISelectorButton[]>([
    {
      class: "text",
      text: "文本"
    },
    {
      class: "scene",
      text: "场景"
    },
    {
      class: "character",
      text: "立绘"
    },
    {
      class: "audio",
      text: "声音"
    },
    {
      class: "camera",
      text: "摄像机"
    },
    {
      class: "widget",
      text: "屏幕组件"
    },
    {
      class: "dialog",
      text: "对话框"
    },
    {
      class: "flow",
      text: "流程控制"
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<TabId>(buttons[0].class);

  const onTabsChanged = (newTabId: TabId, prevTabId: TabId | undefined) => {
    setSelectedTab(newTabId);
  };

  return (
    <div className={"selector-panel"}>
      <Card interactive={false} elevation={Elevation.TWO}>
        <Tabs
          id={"api-selector-tabs"}
          className="api-selector-tabs"
          selectedTabId={selectedTab}
          large={true}
          animate={false}
          vertical={true}
          onChange={onTabsChanged}
        >
          <Tabs.Expander />
          {buttons.map((v) => {
            return (
              <Tab
                onMouseEnter={(
                  e: React.MouseEvent<HTMLDivElement, MouseEvent>
                ) => {
                  var event = new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: false
                  });

                  var node = e.target as HTMLElement;

                  if (node) {
                    node.setAttribute("aria-selected", "true");
                    node.setAttribute("aria-expanded", "true");
                    node.dispatchEvent(event);
                  }
                }}
                id={v.class}
                title={v.text}
              />
            );
          })}
        </Tabs>
      </Card>
    </div>
  );
};
