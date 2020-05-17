import React, { useReducer, useState, useContext } from "react";
import {
  Dialog,
  FormGroup,
  InputGroup,
  Checkbox,
  Classes,
  Button,
  AnchorButton,
  Intent,
  FileInput
} from "@blueprintjs/core";

import "./create-project-dialog.less";

import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { IconNames } from "@blueprintjs/icons";
import { CreatorContext } from "../../hooks/context";
import { GUIToaster } from "../../services/toaster";
import { ipcRenderer } from "electron-better-ipc";
import { IPCEvents } from "../../../../src/common/ipc-events";
import debug from "debug";
const log = debug("s");

export const CreateProjectDialog = () => {
  const { state, dispatch } = useContext(CreatorContext);

  const [projectName, setProjectName] = useState("");
  const [generateTutorial, setGenerateTutorial] = useState(true);

  const handleCreateDialogClose = () => {
    // setIsCreateProjectDialogOpen(false);
    dispatch({
      type: AVGCreatorActionType.ToggleCreateProjectDialog,
      payload: {
        open: false
      }
    });
  };

  const handleConfirmCreateProject = () => {
    if (!projectName || projectName.length === 0) {
      GUIToaster.show({
        message: "请输入游戏名称 ",
        timeout: 1000,
        intent: Intent.WARNING
      });
      return;
    }

    dispatch({
      type: AVGCreatorActionType.CreateProject,
      payload: {
        projectName,
        generateTutorial
      }
    });

    dispatch({
      type: AVGCreatorActionType.ToggleCreateProjectDialog,
      payload: {
        open: false
      }
    });
  };

  const [projectDir, setProjectDir] = useState("");

  const handleBrowse = async () => {
    const paths = await ipcRenderer.callMain<any, string>(
      IPCEvents.IPC_ShowOpenDialog,
      { title: "选择目录" }
    );

    setProjectDir(paths);
  };

  return (
    <Dialog
      className={"create-project-dialog"}
      icon="info-sign"
      onClose={handleCreateDialogClose}
      title="创建游戏"
      isOpen={state.isCreateProjectDialogOpen}
      usePortal={true}
      hasBackdrop={false}
      transitionDuration={0}
      canEscapeKeyClose={true}
    >
      <div className="container">
        <FormGroup inline={false} label={"游戏名称"} labelFor="text-input">
          <InputGroup
            disabled={false}
            defaultValue={projectName}
            leftIcon={IconNames.CUBE_ADD}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              const text = (event.target as HTMLInputElement).value;
              setProjectName(text);
            }}
            placeholder="输入你的游戏名称"
          />
        </FormGroup>
        {/* 
        <FormGroup inline={false} label={"项目路径"}>
          <InputGroup
            placeholder="选择项目的储存目录"
            rightElement={<Button onClick={handleBrowse}>浏览</Button>}
            defaultValue={projectDir}
            value={projectDir}
          />
        </FormGroup> */}

        <FormGroup label={""} labelInfo={"(required)"}>
          <Checkbox
            defaultChecked={generateTutorial}
            label="生成范例代码"
            onChange={(event) => {
              const checked = (event.target as HTMLInputElement).checked;
              setGenerateTutorial(checked);
            }}
          />
        </FormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCreateDialogClose}>取消</Button>
          <AnchorButton
            intent={Intent.PRIMARY}
            onClick={handleConfirmCreateProject}
          >
            创建游戏
          </AnchorButton>
        </div>
      </div>
    </Dialog>
  );
};
