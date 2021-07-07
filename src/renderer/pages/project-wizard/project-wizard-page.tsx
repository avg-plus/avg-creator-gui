import React, { useEffect, useState } from "react";
import {
  MultistepDialog,
  DialogStep,
  FormGroup,
  InputGroup,
  Checkbox,
  Button,
  FileInput,
  Label,
  Intent
} from "@blueprintjs/core";

import "./project-wizard-page.less";
import { ProjectWizardService } from "./project-wizard-page.service";
import { useHotkeys } from "react-hotkeys-hook";
import { GUIAlertDialog } from "../../modals/alert-dialog";
import { useMount } from "react-use";
import ipcObservableRenderer from "../../../common/ipc-observable/ipc-observable-renderer";
import { GlobalEvents } from "../../../common/global-events";

export const ProjectWizardPage = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPath, setProjectPath] = useState("");
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [initialStepIndex, setInitialStepIndex] = useState(0);

  useHotkeys("esc", () => {
    handleClose();
  });

  const clearState = () => {
    setProjectName("");
    setProjectDescription("");
    setProjectPath("");
    setIsCreateLoading(false);
    setInitialStepIndex(-1);
  };

  const handleBrowse = () => {
    const dir = ProjectWizardService.selectProjectDir();
    if (dir) {
      setProjectPath(dir);
    }
  };

  const handleClose = () => {
    clearState();

    setTimeout(() => {
      ProjectWizardService.close();
    }, 10);
  };

  const basicInfoPageNextEnabled = () => {
    return (
      ProjectWizardService.validateProjectName(projectName) &&
      ProjectWizardService.validateProjectDescription(projectDescription)
    );
  };

  const handleCreate = async () => {
    setIsCreateLoading(true);
    const alertMessage = await ProjectWizardService.createProject(
      projectName,
      projectDescription,
      projectPath
    );

    if (alertMessage && alertMessage.length) {
      GUIAlertDialog.show({
        text: (
          <>
            <p>创建项目失败。</p>
            <p />
            <p>{alertMessage}</p>
          </>
        ),
        intent: Intent.WARNING,
        icon: "warning-sign"
      });
    } else {
      handleClose();
    }

    setIsCreateLoading(false);
  };

  useEffect(() => {}, [projectName, projectDescription, projectPath]);

  return (
    <div>
      {/* Use trick to locate this button */}
      <Button className={"close-button"} onClick={handleClose}>
        关闭
      </Button>
      <MultistepDialog
        className={"project-wizard-container"}
        icon="info-sign"
        isOpen={true}
        initialStepIndex={initialStepIndex}
        resetOnClose={true}
        isCloseButtonShown={true}
        nextButtonProps={{
          text: "下一步",
          disabled: !basicInfoPageNextEnabled()
        }}
        backButtonProps={{ text: "后退" }}
        finalButtonProps={{
          text: "创建项目",
          loading: isCreateLoading,
          onClick: handleCreate
        }}
      >
        <DialogStep
          id="basic"
          title="基本信息"
          panel={
            <div className={"panel-container"}>
              <FormGroup
                helperText="该名称作为您的游戏项目名，并会呈现给用户"
                label="游戏名称"
                labelFor="project-name"
                labelInfo="(*)"
              >
                <InputGroup
                  id="project-name"
                  placeholder="输入你的游戏名称"
                  maxLength={64}
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup
                helperText="输入项目的描述"
                label="描述"
                labelFor="project-description"
              >
                <InputGroup
                  id="project-description"
                  placeholder="项目描述，此内容仅作为项目备注"
                  maxLength={512}
                  value={projectDescription}
                  onChange={(e) => {
                    setProjectDescription(e.target.value);
                  }}
                />
              </FormGroup>
            </div>
          }
        />
        <DialogStep
          id="project-path"
          panel={
            <div className={"panel-container"}>
              <FormGroup
                inline={false}
                label={"储存路径"}
                helperText={
                  <div className={"helper-text"}>
                    {ProjectWizardService.getPathStatus(projectPath)}
                  </div>
                }
                labelFor="project-dir"
              >
                <Label disabled={true}>
                  AVGPlus 会自动在您的路径下创建名为 <b>{projectName}</b>{" "}
                  的子目录。
                </Label>
                <InputGroup
                  id="project-dir"
                  placeholder=""
                  rightElement={
                    <Button onClick={handleBrowse}>浏览目录</Button>
                  }
                  multiple={false}
                  value={projectPath}
                  onChange={(e) => {
                    setProjectPath(e.target.value);
                  }}
                />
              </FormGroup>
            </div>
          }
          title="选择储存路径"
        />
      </MultistepDialog>
    </div>
  );
};
