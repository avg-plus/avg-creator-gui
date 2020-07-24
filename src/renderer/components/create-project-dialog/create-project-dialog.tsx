import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback
} from "react";

import {
  Dialog,
  FormGroup,
  InputGroup,
  Checkbox,
  Classes,
  Button,
  Intent,
  Drawer
} from "@blueprintjs/core";

import hotkeys from "hotkeys-js";
import { useHotkeys } from "react-hotkeys-hook";

import "./create-project-dialog.less";

import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { IconNames } from "@blueprintjs/icons";
import { CreatorContext } from "../../hooks/context";
import { GUIToaster } from "../../services/toaster";
import { AVGProjectManager } from "../../../renderer/manager/project-manager";
import { BundlesManager } from "../../services/bundles-manager/bundles-manager";
import { logger } from "../../../common/lib/logger";
import { useMount } from "react-use";

export const CreateProjectDialog = () => {
  const { state, dispatch } = useContext(CreatorContext);

  const [projectName, setProjectName] = useState("");
  const [generateTutorial, setGenerateTutorial] = useState(true);
  const [projectNameInputIntent, setProjectNameInputIntent] = useState<Intent>(
    Intent.PRIMARY
  );
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [nameInputRef, setNameInputRef] = useState<HTMLInputElement | null>();

  useMount(async () => {
    const bundles = await BundlesManager.loadLocalBundles();
    logger.info("bundles", Array.from(bundles.values()));
  });

  nameInputRef?.focus();

  // 清除状态
  const clearState = () => {
    setProjectName("");
    setGenerateTutorial(true);
    setIsCreateLoading(false);

    hotkeys.unbind("enter");
  };

  const handleCreateDialogClose = () => {
    dispatch({
      type: AVGCreatorActionType.ToggleCreateProjectDialog,
      payload: {
        open: false
      }
    });

    clearState();
  };

  const handleConfirmCreateProject = () => {
    console.log("handleConfirmCreateProject", projectName);

    if (!projectName || projectName.length === 0) {
      GUIToaster.show({
        message: "请输入游戏名称",
        timeout: 1000,
        intent: Intent.WARNING
      });

      setProjectNameInputIntent(Intent.DANGER);
      nameInputRef?.focus();
      return;
    }

    if (!projectName.match(/^[^<>:;,?"*|/]+$/g)) {
      GUIToaster.show({
        message: `名称不允许包含以下特殊符号：<>:;,?"*|/`,
        timeout: 3000,
        intent: Intent.WARNING
      });
      setProjectNameInputIntent(Intent.DANGER);
      nameInputRef?.focus();
      return;
    }

    // 创建项目
    setIsCreateLoading(true);

    const newProject = AVGProjectManager.createProject(
      projectName,
      generateTutorial
    )
      .then((project) => {
        dispatch({
          type: AVGCreatorActionType.AddProjectItem,
          payload: {
            project
          }
        });

        dispatch({
          type: AVGCreatorActionType.ToggleCreateProjectDialog,
          payload: {
            open: false
          }
        });
      })
      .catch((error) => {
        GUIToaster.show({
          message: error,
          timeout: 4000,
          intent: Intent.DANGER
        });
      })
      .finally(() => {
        clearState();
      });
  };

  const handleProjectNameInputChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const text = (event.target as HTMLInputElement).value;
    console.log("handleProjectNameInputChanged", text);

    setProjectName(text);
  };

  useHotkeys(
    "enter",
    () => {
      handleConfirmCreateProject();
    },
    { filter: () => true },
    [projectName]
  );

  return (
    <Drawer
      className={"create-project-dialog"}
      isOpen={state.isCreateProjectDialogOpen}
      position={"bottom"}
      title="创建游戏"
      icon="info-sign"
      canOutsideClickClose={true}
      onClose={handleCreateDialogClose}
      hasBackdrop={false}
      autoFocus={true}
      enforceFocus={true}
      usePortal={true}
      onClosed={() => {
        dispatch({
          type: AVGCreatorActionType.ToggleCreateProjectDialog,
          payload: {
            open: false
          }
        });
      }}
    >
      <div className="container">
        <FormGroup inline={false} label={"游戏名称"} labelFor="text-input">
          <InputGroup
            disabled={isCreateLoading}
            value={projectName}
            intent={projectNameInputIntent}
            leftIcon={IconNames.CUBE_ADD}
            inputRef={(input) => {
              setNameInputRef(input);
            }}
            onChange={handleProjectNameInputChanged}
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
          <Button
            intent={Intent.PRIMARY}
            type="submit"
            loading={isCreateLoading}
            onClick={handleConfirmCreateProject}
          >
            创建游戏
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
