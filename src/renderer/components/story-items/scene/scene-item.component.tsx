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
    props.item.onRefInit(ref);
  });

  return (
    <div className={"scene-item"} style={{ background: `url(${testBG})` }}>
      <div className={"name"}>{props.item.sceneName}</div>
    </div>
  );
};

export const render = (data: SceneItem) => {
  return <SceneItemComponent item={data}></SceneItemComponent>;
};

export const renderExtendContextMenu = () => {
  return [];
};
