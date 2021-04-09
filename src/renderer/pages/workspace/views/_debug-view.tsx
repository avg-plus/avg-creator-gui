import { Button } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { GlobalEvents } from "../../../../common/global-events";
import { autoSubScribe } from "../../../../common/utils";
import { WorkspaceDebugUI } from "../../../../common/services/workspace-debug-ui";

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

  return (
    <div>
      {components.map((v) => {
        return (
          <Button key={v.text} onClick={v.callback}>
            {v.text}
          </Button>
        );
      })}
    </div>
  );
};
