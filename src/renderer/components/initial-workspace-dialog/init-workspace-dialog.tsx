import React, { useState, useContext } from "react";
import { useMount } from "react-use";
import fs from "fs-extra";

import {
  Dialog,
  FormGroup,
  InputGroup,
  Classes,
  Button,
  AnchorButton,
  Intent
} from "@blueprintjs/core";

import "./init-workspace-dialog.less";

import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { CreatorContext } from "../../hooks/context";
import { ipcRenderer } from "electron-better-ipc";
import { IPCEvents } from "../../../common/ipc-events";
import { GUIToaster } from "../../../../src/renderer/services/toaster";
import { IconNames } from "@blueprintjs/icons";
import { nconf } from "../../../common/config";

export const InitWorkspaceDialog = () => {
  const { state, dispatch } = useContext(CreatorContext);

  const [workspaceDir, setWorkspaceDir] = useState("");

  const handleBrowse = async () => {
    const paths = await ipcRenderer.callMain<any, string>(
      IPCEvents.IPC_ShowOpenDialog,
      { title: "选择工作目录" }
    );

    if (paths && paths.length > 0) {
      setWorkspaceDir(paths[0]);
    }
  };

  const handleDialogClose = async () => {
    dispatch({
      type: AVGCreatorActionType.ToggleSetWorkspaceDialog,
      payload: {
        open: false
      }
    });
  };

  const handleConfirmWorkspace = async () => {
    if (!workspaceDir || workspaceDir.trim().length === 0) {
      GUIToaster.show({
        message: "工作目录不能为空。",
        icon: IconNames.WARNING_SIGN,
        intent: Intent.WARNING
      });
      return;
    }

    if (!fs.existsSync(workspaceDir)) {
      GUIToaster.show({
        message: "工作目录不存在。",
        icon: IconNames.WARNING_SIGN,
        intent: Intent.WARNING
      });
      return;
    }

    GUIToaster.show({
      message: "工作目录设置成功",
      icon: IconNames.TICK,
      intent: Intent.SUCCESS
    });

    nconf.set("workspace", workspaceDir);
    nconf.save();

    handleDialogClose();
  };

  const handlePathChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    setWorkspaceDir(e.target.value);
  };

  useMount(() => {
    setWorkspaceDir("");
  });

  return (
    <Dialog
      className={"create-project-dialog"}
      icon="info-sign"
      title="设置工作目录"
      isOpen={state.isSetWorkspaceDialogOpen}
      usePortal={true}
      hasBackdrop={false}
      transitionDuration={0}
      canEscapeKeyClose={true}
    >
      <div className="container">
        <FormGroup inline={false} label={"项目路径"}>
          <InputGroup
            placeholder="选择项目的储存目录"
            rightElement={<Button onClick={handleBrowse}>浏览</Button>}
            value={workspaceDir}
            onChange={handlePathChanged}
          />
        </FormGroup>

        <div className="hint bp3-text-muted center">
          在开始创建项目前，请设置一个用于储存项目的默认目录。后续所有的游戏都将储存到该目录中。
        </div>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleDialogClose}>取消</Button>
          <AnchorButton
            intent={Intent.PRIMARY}
            onClick={handleConfirmWorkspace}
          >
            确定
          </AnchorButton>
        </div>
      </div>
    </Dialog>
  );
};
