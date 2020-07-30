import { Menu, Intent } from "@blueprintjs/core";
import React, { useContext, useEffect, useState } from "react";
import { CreatorContext } from "../../hooks/context";
import { stat } from "fs";
import { AVGProjectData } from "../../manager/project-manager";
import { IAVGServer } from "../../redux/reducers/avg-creator-reducers";

interface IProjectItemContextMenuProps {
  server: IAVGServer;
  onDelete: () => void;
  onExploreDir: () => void;
  onOpenInVSCode: () => void;
  onServe: () => void;
}

export const ProjectItemContextMenu = (props: IProjectItemContextMenuProps) => {
  const { state, dispatch } = useContext(CreatorContext);
  const [running, setRunning] = useState(false);

  // useEffect(() => {
  //   setRunning(state.currentServer.isRunning);
  // }, [props.server.]);

  return (
    <>
      <Menu>
        <Menu.Item
          icon="applications"
          onClick={props.onServe}
          intent={!props.server.isRunning ? Intent.NONE : Intent.DANGER}
          text={!props.server.isRunning ? "运行" : "停止"}
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
          text="删除项目"
          onClick={props.onDelete}
        />
        <Menu.Divider />
        <Menu.Item
          icon="folder-shared-open"
          onClick={props.onExploreDir}
          text="打开项目目录"
        />
      </Menu>
    </>
  );
};
