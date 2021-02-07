import React, { useRef, useState } from "react";

import { IComponentProps } from "../component-props";
import { CharacterItem } from "./character-item";

import "./character-item.component.less";
import { useMount } from "react-use";

interface IWaitComponentProps extends IComponentProps<CharacterItem> {}
const CharacterItemComponent = (props: IWaitComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMount(() => {
    props.item.onRefInit(ref);
  });

  return <>通用立绘</>;
};

export const render = (data: CharacterItem) => {
  return <CharacterItemComponent item={data}></CharacterItemComponent>;
};
