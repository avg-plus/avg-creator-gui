import React, { useReducer, useState, useContext } from "react";
import {
  Dialog,
  FormGroup,
  InputGroup,
  Checkbox,
  Classes,
  Button,
  AnchorButton,
  Intent
} from "@blueprintjs/core";

import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { IconNames } from "@blueprintjs/icons";
import { CreatorContext } from "../../hooks/context";
import { GUIToaster } from "../../services/toaster";

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
