import { Menu } from "@blueprintjs/core";
import React, { useContext } from "react";
import { CreatorContext } from "../../../renderer/hooks/context";
import {
  AVGCreatorActionType,
  AVGCreatorAction
} from "../../../renderer/redux/actions/avg-creator-actions";

interface IProjectListContextMenuProps {
  dispatch: React.Dispatch<AVGCreatorAction>;
}

export const ProjectListContextMenu = (props: IProjectListContextMenuProps) => {
  const handleCreateProject = () => {
    props.dispatch({
      type: AVGCreatorActionType.ToggleCreateProjectDialog,
      payload: {
        open: true
      }
    });
  };

  return (
    <Menu>
      <Menu.Item
        icon="cube-add"
        text="创建项目..."
        onClick={handleCreateProject}
      />
    </Menu>
  );
};
