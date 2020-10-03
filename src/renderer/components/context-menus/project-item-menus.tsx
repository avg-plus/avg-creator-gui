import { Menu, Intent } from "@blueprintjs/core";
import React, { useContext, useEffect, useState } from "react";
import { IAVGServer } from "../../redux/reducers/avg-creator-reducers";
import { Env } from "../../../common/env";
import { WorkspaceLayout } from "../../services/workspace-layout";

interface IProjectItemContextMenuProps {
  server: IAVGServer;
  onDelete: () => void;
  onOpenProjectDetail: () => void;
  onExploreDir: () => void;
  onOpenInVSCode: () => void;
  onServe: () => void;
}

export const ProjectItemContextMenu = (props: IProjectItemContextMenuProps) => {
  const [running, setRunning] = useState(false);

  // useEffect(() => {
  //   setRunning(state.currentServer.isRunning);
  // }, [props.server.]);

  return (
    <>
      <Menu>
        {/* <Menu.Item
          icon="applications"
          onClick={props.onServe}
          intent={!props.server.isRunning ? Intent.NONE : Intent.DANGER}
          text={!props.server.isRunning ? "运行" : "停止"}
        /> */}

        <Menu.Item
          icon="applications"
          intent={Intent.NONE}
          text={"项目详情"}
          onClick={props.onOpenProjectDetail}
        />
        <Menu.Item
          icon="code"
          onClick={props.onOpenInVSCode}
          text="在 VSCode 中打开"
        />
        <Menu.Divider />
        <Menu.Item
          icon="trash"
          intent="danger"
          text="移除项目"
          onClick={props.onDelete}
        />
        <Menu.Divider />
        <Menu.Item
          icon="folder-shared-open"
          onClick={props.onExploreDir}
          text="打开项目目录"
        />
        {Env.isDevelopment() && (
          <Menu.Item
            icon="lab-test"
            intent={Intent.NONE}
            text={"【Debug】打开编辑器"}
            onClick={() => {
              WorkspaceLayout.launchWindow();
            }}
          />
        )}
      </Menu>
    </>
  );
};
