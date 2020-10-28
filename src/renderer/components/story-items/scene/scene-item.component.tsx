import React, { useRef } from "react";
import { useMount } from "react-use";
import { IComponentProps } from "../component-props";
import { SceneItem } from "./scene-item";

import "./scene-item.component.less";

interface ISceneComponentProps extends IComponentProps<SceneItem> {}
const SceneItemComponent = (props: ISceneComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMount(() => {
    props.data.onRefInit(ref);
  });

  return <>这是一个场景 房间</>;
};

export const render = (data: SceneItem) => {
  return <SceneItemComponent data={data}></SceneItemComponent>;
};
