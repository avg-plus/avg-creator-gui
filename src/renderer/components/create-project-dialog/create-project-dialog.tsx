import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback
} from "react";

import path from "path";

import {
  Dialog,
  FormGroup,
  InputGroup,
  Checkbox,
  Classes,
  Button,
  Intent,
  Drawer,
  MenuItem,
  Tag
} from "@blueprintjs/core";
import Divider from "antd/lib/divider";
import Select from "react-select";

import { useHotkeys } from "react-hotkeys-hook";

import "./create-project-dialog.less";

import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { IconNames } from "@blueprintjs/icons";
import { CreatorContext } from "../../hooks/context";
import { GUIToaster } from "../../common/toaster";
import {
  AVGProjectData,
  AVGProjectManager
} from "../../../common/manager/project-manager.v2.ts";
import {
  BundlesManager,
  ILocalBundle,
  BundleType
} from "../../../common/services/bundles-manager/bundles-manager";
import { LocalAppConfig } from "../../../common/local-app-config";
import { useMount } from "react-use";
import { logger } from "../../../common/lib/logger";
import { GUIAlertDialog } from "../../modals/alert-dialog";

export interface BundleOption {
  value: string;
  label: string;
  bundle: ILocalBundle;
}

export default () => {
  const { state, dispatch } = useContext(CreatorContext);

  const isImportMode = state.isCreateProjectDialogMode === "import";
  const importDir = state.importDir;

  const [projectName, setProjectName] = useState(
    isImportMode ? path.basename(importDir) : ""
  );

  const [projectNameInputIntent, setProjectNameInputIntent] = useState<Intent>(
    Intent.PRIMARY
  );
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [nameInputRef, setNameInputRef] = useState<HTMLInputElement | null>();

  const [localBundles, setLocalBundles] = useState<ILocalBundle[]>([]);

  const defaultEngineBundleHash = LocalAppConfig.get("defaultEngine") as string;

  const [
    selectedEngineBundle,
    setSelectedEngineBundle
  ] = useState<BundleOption>();

  const [
    selectedTemplateBundle,
    setSelectedTemplateBundle
  ] = useState<BundleOption | null>();

  const [isSupportDesktop, setIsSupportDesktop] = useState<boolean>(true);
  const [isSupportBrowser, setIsSupportBrowser] = useState<boolean>(true);

  const [engineOptions, setEngineOptions] = useState<BundleOption[]>([]);
  const [templateOptions, setTemplateOptions] = useState<BundleOption[]>([]);

  // 清除状态
  const clearState = () => {
    setProjectName("");
    // setGenerateTutorial(true);
    setIsCreateLoading(false);
    setProjectNameInputIntent(Intent.NONE);
  };

  const handleCreateDialogClose = () => {
    dispatch({
      type: AVGCreatorActionType.OpenCreateProjectDialog,
      payload: {
        open: false
      }
    });

    clearState();
  };

  const handleConfirmCreateProject = () => {
    logger.debug("create project", projectName);

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

    if (!isSupportBrowser && !isSupportDesktop) {
      GUIToaster.show({
        message: `至少要选择支持一个平台~`,
        timeout: 2000,
        intent: Intent.WARNING
      });
      return;
    }

    if (!selectedEngineBundle) {
      GUIToaster.show({
        message: `必须选择一个引擎开发包`,
        timeout: 2000,
        intent: Intent.WARNING
      });
      return;
    }

    // 创建项目
    setIsCreateLoading(true);

    if (isImportMode) {
      // 导入项目
      AVGProjectManager.migrateImportProject(
        projectName,
        importDir,
        selectedEngineBundle.bundle.hash,
        isSupportDesktop,
        isSupportBrowser
      ).finally(() => {
        // 重新加载项目列表
        AVGProjectManager.loadProjects().then((v) => {
          logger.debug("loaded projects", v);
          dispatch({
            type: AVGCreatorActionType.SetProjectList,
            payload: {
              projects: v
            }
          });
        });

        handleCreateDialogClose();
      });
    } else {
      if (!selectedTemplateBundle) {
        GUIToaster.show({
          message: `请选择创建的项目类型（模板）`,
          timeout: 2000,
          intent: Intent.WARNING
        });
        return;
      }

      AVGProjectManager.createProject(
        projectName,
        isSupportDesktop,
        isSupportBrowser,
        selectedEngineBundle,
        selectedTemplateBundle
      )
        .then((project) => {
          dispatch({
            type: AVGCreatorActionType.AddProjectItem,
            payload: {
              project
            }
          });

          handleCreateDialogClose();
        })
        .catch((error: Error) => {
          GUIToaster.show({
            message: error.message,
            timeout: 4000,
            intent: Intent.DANGER
          });
        })
        .finally(() => {
          clearState();
        });
    }
  };

  const handleProjectNameInputChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const text = (event.target as HTMLInputElement).value;
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

  const renderOptions = (type: BundleType): BundleOption[] => {
    const bundles = localBundles.filter(
      (bundle) => bundle.bundleInfo.type == type
    );

    if (!bundles || !bundles.length) {
      return [];
    }

    let options: any[] = [];
    for (const bundle of bundles) {
      options.push({
        value: bundle.hash,
        label: bundle.bundleInfo.name,
        bundle
      });
    }

    return options;
  };

  useMount(() => {
    nameInputRef?.focus();

    // 加载本地打包的数据
    const bundles = Array.from(BundlesManager.localBundles.values());
    setLocalBundles(bundles);
  });

  const dialogOpenning = () => {
    // 初始化引擎列表
    setEngineOptions(renderOptions(BundleType.Engine));
    setTemplateOptions(renderOptions(BundleType.Template));
  };

  useEffect(() => {
    // 获取默认值
    let defaultEngineOption = engineOptions.find((v) => {
      return v.value === defaultEngineBundleHash;
    });

    if (!defaultEngineOption && engineOptions.length) {
      defaultEngineOption = engineOptions[0];
    }

    setSelectedEngineBundle(defaultEngineOption);
    setSelectedTemplateBundle(renderOptions(BundleType.Template)[0]);
  }, [engineOptions]);

  const formatOptionLabel = ({
    value,
    label,
    bundle
  }: {
    value: string;
    label: string;
    bundle: ILocalBundle;
  }) => {
    return (
      <div style={{ display: "flex" }}>
        <div>
          {label} {"   "}
          {defaultEngineBundleHash === bundle.hash && (
            <Tag intent={Intent.SUCCESS}>默认</Tag>
          )}
        </div>
        <div style={{ marginLeft: "10px", color: "#ccc" }}>
          {bundle.bundleInfo.description}
        </div>
      </div>
    );
  };

  const optionStyles = {
    menuList: (provided: any, state: any) => ({
      ...provided,
      maxHeight: "200px"
    })
  };

  return (
    <Drawer
      className={"create-project-dialog"}
      isOpen={state.isCreateProjectDialogOpen}
      position={"bottom"}
      size={"80%"}
      title={isImportMode ? "导入项目" : "创建游戏"}
      // icon="info-sign"
      canOutsideClickClose={false}
      onClose={handleCreateDialogClose}
      hasBackdrop={false}
      autoFocus={true}
      enforceFocus={true}
      usePortal={true}
      onOpening={dialogOpenning}
      onClosing={() => {
        handleCreateDialogClose();
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

        <FormGroup inline={true} label={"跨平台支持"} labelFor="text-input">
          <Checkbox
            value="browser"
            checked={isSupportDesktop}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIsSupportDesktop(e.target.checked);
            }}
            label="桌面平台 Windows & MacOS"
          />
          <Checkbox
            value="desktop"
            checked={isSupportBrowser}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIsSupportBrowser(e.target.checked);
            }}
            label="浏览器"
          />
        </FormGroup>

        <FormGroup inline={false} label={"引擎版本"} labelFor="text-input">
          <Select
            options={engineOptions}
            styles={optionStyles}
            value={selectedEngineBundle}
            formatOptionLabel={formatOptionLabel}
            onChange={(value) => {
              setSelectedEngineBundle(value as any);
            }}
            isSearchable={false}
          />
        </FormGroup>

        {!isImportMode && (
          <FormGroup inline={false} label={"模板项目"} labelFor="text-input">
            <Select
              options={renderOptions(BundleType.Template)}
              styles={optionStyles}
              value={
                selectedTemplateBundle ?? renderOptions(BundleType.Template)[0]
              }
              formatOptionLabel={formatOptionLabel}
              onChange={(value) => {
                setSelectedTemplateBundle(value as any);
              }}
              isSearchable={false}
            />
          </FormGroup>
        )}
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
            {isImportMode ? "导入项目" : "创建游戏"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
