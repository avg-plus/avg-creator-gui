import { Intent, Menu } from "@blueprintjs/core";
import { remote } from "electron";
import React, { useContext } from "react";
import { assert } from "../../../common/exception";
import { CreatorContext } from "../../../renderer/hooks/context";
import {
  AVGCreatorActionType,
  AVGCreatorAction
} from "../../../renderer/redux/actions/avg-creator-actions";
import { AVGProjectManager } from "../../manager/project-manager";
import { GUIAlertDialog } from "../../modals/alert-dialog";
import { GUIToaster } from "../../services/toaster";

interface IProjectListContextMenuProps {
  dispatch: React.Dispatch<AVGCreatorAction>;
}

export const ProjectListContextMenu = (props: IProjectListContextMenuProps) => {
  const handleCreateProject = () => {
    props.dispatch({
      type: AVGCreatorActionType.OpenCreateProjectDialog,
      payload: {
        open: true,
        mode: "create"
      }
    });
  };

  const handleLoadProjects = async () => {
    AVGProjectManager.loadProjects().then((v) => {
      props.dispatch({
        type: AVGCreatorActionType.SetProjectList,
        payload: {
          projects: v
        }
      });
    });
  };

  const handleImportProject = async () => {
    // ContextMenu.hide();
    const paths = remote.dialog.showOpenDialogSync({
      title: "选择项目目录",
      properties: ["openDirectory"]
    });

    if (paths && paths.length > 0) {
      const importDir = paths[0];
      const result = AVGProjectManager.readProject(importDir);
      if (!result) {
        const dialogResult = await GUIAlertDialog.show({
          text: "该目录并不是一个有效的 AVGPlus 项目，是否执行初始化？",
          icon: "help",
          intent: Intent.PRIMARY,
          confirmButtonText: "是",
          cancelButtonText: "否"
        });

        if (dialogResult.isConfirm) {
          props.dispatch({
            type: AVGCreatorActionType.OpenCreateProjectDialog,
            payload: {
              open: true,
              mode: "import",
              importDir
            }
          });
        }
      } else {
        try {
          await AVGProjectManager.importProject(importDir);
          handleLoadProjects();
        } catch (error) {
          GUIAlertDialog.show({ text: error.message, icon: "info-sign" });
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
      <Menu.Divider />
      <Menu.Item icon="refresh" text="重新加载" onClick={handleLoadProjects} />
    </Menu>
  );
};
