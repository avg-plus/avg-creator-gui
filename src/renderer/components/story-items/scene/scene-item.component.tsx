import React, { useRef } from "react";
import { useMount } from "react-use";
import { IComponentProps } from "../component-props";
import { SceneItem } from "./scene-item";

import "./scene-item.component.less";

import testBG from "../../../images/fake-data/居酒屋-2560x1440.png";

interface ISceneComponentProps extends IComponentProps<SceneItem> {}
const SceneItemComponent = (props: ISceneComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMount(() => {
    props.data.onRefInit(ref);
  });

  return <> 这是一个场景{/* <img src={testBG} /> */}</>;
};

export const render = (data: SceneItem) => {
  return <SceneItemComponent data={data}></SceneItemComponent>;
};
