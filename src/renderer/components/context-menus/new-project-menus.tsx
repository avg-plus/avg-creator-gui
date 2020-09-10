import { Menu, ContextMenu, Intent } from "@blueprintjs/core";
import React from "react";
import {
  AVGCreatorActionType,
  AVGCreatorAction
} from "../../../renderer/redux/actions/avg-creator-actions";
import { remote } from "electron";
import { assert } from "console";
import { AVGProjectManager } from "../../manager/project-manager";
import { GUIAlertDialog } from "../../modals/alert-dialog";

interface IProjectListContextMenuProps {
  dispatch: React.Dispatch<AVGCreatorAction>;
}

export const NewProjectContextMenu = (props: IProjectListContextMenuProps) => {
  const handleCreateProject = () => {
    props.dispatch({
      type: AVGCreatorActionType.OpenCreateProjectDialog,
      payload: {
        open: true
      }
    });
  };

  const handleImportProject = async () => {
    // ContextMenu.hide();
    const paths = remote.dialog.showOpenDialogSync({
      title: "选择项目目录",
      properties: ["openDirectory"]
    });

    if (paths && paths.length > 0) {
      const result = await AVGProjectManager.importProject(paths[0]);
      if (!result) {
        const dialogResult = await GUIAlertDialog.show({
          text: "该目录并不是一个有效的 AVGPlus 项目，是否执行初始化？",
          icon: "help",
          intent: Intent.PRIMARY,
          confirmButtonText: "是",
          cancelButtonText: "否"
        });

        if (dialogResult.isConfirm) {
        }
      }
    }
  };

  return (
    <Menu>
      <Menu.Item
        icon="cube-add"
        text="创建项目..."
        onClick={handleCreateProject}
      />
      <Menu.Item
        icon="import"
        text="从本地导入..."
        onClick={handleImportProject}
      />
    </Menu>
  );
};
