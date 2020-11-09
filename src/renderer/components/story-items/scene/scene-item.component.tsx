import React, { useRef } from "react";
import { useMount } from "react-use";
import { IComponentProps } from "../component-props";
import { SceneItem } from "./scene-item";

import "./scene-item.component.less";

import testBG from "../../../images/fake-data/居酒屋-2560x1440.png";
import { MenuDivider, MenuItem } from "@blueprintjs/core";

interface ISceneComponentProps extends IComponentProps<SceneItem> {}
const SceneItemComponent = (props: ISceneComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMount(() => {
    props.data.onRefInit(ref);
  });

  return (
    <div className={"scene-item"} style={{ background: `url(${testBG})` }}>
      <div className={"name"}>{props.data.sceneName}</div>
    </div>
  );
};

export const render = (data: SceneItem) => {
  return <SceneItemComponent data={data}></SceneItemComponent>;
};

export const renderExtendContextMenu = () => {
  return [
    <MenuDivider title="文本" />,
    <MenuItem text="显示对话" />,
    <MenuDivider title="角色" />,
    <MenuItem text="显示立绘" />,
    <MenuItem text="执行立绘动画" />,
    <MenuItem text="隐藏立绘" />,
    <MenuDivider title="高级" />,
    <MenuItem text="自定义脚本" />
  ];
};
