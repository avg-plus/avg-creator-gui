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

  return (
    <div className={"scene-item"} style={{ background: `url(${testBG})` }}>
      <div className={"name"}>{props.data.sceneName}</div>
    </div>
  );
};

export const render = (data: SceneItem) => {
  return <SceneItemComponent data={data}></SceneItemComponent>;
};
