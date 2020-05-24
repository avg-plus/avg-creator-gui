/** @format */

import React, { ReactText, useState } from "react";
import {
  IPanelProps,
  FormGroup,
  InputGroup,
  FileInput,
  Checkbox,
  Tabs,
  Tab,
  Tag,
  Slider,
  Button
} from "@blueprintjs/core";

import "./ProjectSettingPanel.less";
import { Row, Col } from "antd";
import { AVGProjectData } from "../manager/project-manager";

interface IProjectSettingPanelState {
  selectedTab: string;
  project?: Partial<AVGProjectData>;
}

enum SettingPanelTabID {
  BasePanel = "base-panel",
  GamePanel = "game-panel",
  AdvancedPanel = "advanced-panel"
}

const handleTabChange = (navbarTabId: SettingPanelTabID) => {
  // this.setState({
  //   selectedTab: navbarTabId,
  // });
};

const BaseSettingPanel = ({ project }) => {
  // const currentProject = store.getState().AVGCreatorReducer.data.project;

  return (
    <>
      <FormGroup
        helperText="游戏项目的名字，入「白色相簿2」"
        label="项目名称"
        labelFor="project-name-input"
        labelInfo="(*)"
      >
        <InputGroup id="project-name-input" defaultValue={project.name} />
      </FormGroup>

      <FormGroup
        helperText="为游戏项目写一个简短的说明"
        label="描述"
        labelFor="project-description-input"
      >
        <InputGroup
          className="dir-path-input"
          id="project-description-input"
          defaultValue={project.description}
        />
      </FormGroup>

      <FormGroup
        helperText="游戏项目的目录路径"
        label="项目目录"
        labelFor="project-dir-input"
      >
        <FileInput
          id="project-dir-input"
          buttonText="选择目录"
          text="选择游戏项目目录"
        />
      </FormGroup>
    </>
  );
};

const AdvancedSettingPanel = ({ project }) => {
  return (
    <>
      <FormGroup
        label={
          <label>监听地址</label>
          // <Tooltip
          //   content={<span className="tooltip">游戏的监听地址，将在浏览器打开，如：http://localhost:2335</span>}
          //   position={Position.LEFT}
          //   interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
          //   usePortal={false}
          //   isOpen={true}
          // >
          //   <div>
          //     监听地址
          //     <Icon icon={IconNames.HELP} />
          //   </div>
          // </Tooltip>
        }
        labelFor="project-name-input"
      >
        <InputGroup
          placeholder="如 http://localhost:2335"
          defaultValue={project.host}
        />
        <Checkbox label="自定义" />
      </FormGroup>
    </>
  );
};

interface IGamePanelProps {
  screenWidth: number;
  screenHeight: number;
  isFullScreen: boolean;
  textSpeed: number;
  autoPlay: boolean;
  volume: number;
}

const GameSettingPanel = (project: AVGProjectData) => {
  return (
    <>
      <div className="form-group-line">
        <label className="form-label">游戏分辨率</label>
        <div className="controls-container">
          <Row gutter={12}>
            <Col span={12}>
              <InputGroup
                rightElement={<Tag minimal={true}>宽</Tag>}
                small={true}
                defaultValue={project.screenWidth.toString()}
              />
            </Col>
            <Col span={12}>
              <InputGroup
                rightElement={<Tag minimal={true}>高</Tag>}
                small={true}
                defaultValue={project.screenHeight.toString()}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="form-group-line">
        <div className="controls-container">
          <Checkbox label="全屏显示" checked={project.isFullScreen} />
        </div>
      </div>

      <div className="form-group-line">
        <label className="form-label">对话文本</label>
        <div className="controls-container">
          <Slider
            min={0}
            max={100}
            stepSize={1}
            labelStepSize={1}
            value={project.textSpeed}
            vertical={false}
            labelRenderer={(value: number) => {
              if (value === 0) {
                return (
                  <div style={{ wordBreak: "keep-all", marginLeft: "30px" }}>
                    非常慢
                  </div>
                );
              } else if (value === 25) {
                return <p>稍慢</p>;
              } else if (value === 50) {
                return <p>正常</p>;
              } else if (value === 75) {
                return <p>稍快</p>;
              } else if (value === 100) {
                return (
                  <div style={{ wordBreak: "keep-all", marginRight: "30px" }}>
                    非常快
                  </div>
                );
              }

              return <></>;
            }}
          />
        </div>
      </div>

      <div className="form-group-line">
        <div className="controls-container">
          <Checkbox label="对话自动播放" checked={project.autoPlay} />
        </div>
      </div>

      <div className="form-group-line">
        <label className="form-label">声音</label>
        <div className="controls-container">
          <Slider
            min={0}
            max={100}
            stepSize={1}
            labelStepSize={10}
            value={project.volume}
            vertical={false}
          />
        </div>
      </div>
    </>
  );
};

export const ProjectSettingPanel: React.FC<{ project: AVGProjectData }> = ({
  project
}) => {
  // console.log("Load props ", props);
  const [p, setProject] = useState(project);

  return (
    <div className="setting-panel-container">
      {/* vvvvv: {project.volume} */}
      {/* selectedTabId={this.state.selectedTab} */}
      {/*  */}
      <Tabs id="TabsExample" onChange={handleTabChange}>
        <Tab
          id={SettingPanelTabID.BasePanel}
          title="基本"
          panel={BaseSettingPanel({ project })}
        />
        <Tab
          id={SettingPanelTabID.GamePanel}
          title="初始游戏设置"
          panel={GameSettingPanel(project)}
          panelClassName="ember-panel"
        />
        <Tab
          id={SettingPanelTabID.AdvancedPanel}
          title="高级"
          panel={AdvancedSettingPanel({ project })}
          panelClassName="ember-panel"
        />
      </Tabs>

      <Button
        onClick={() => {
          project.name = "xxxx";
          setProject({ ...project });
        }}
      >
        保存
      </Button>
    </div>
  );
};
