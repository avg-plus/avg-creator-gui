import React, { useRef } from "react";
import { IComponentProps } from "../component-props";
import { WaitItem } from "./wait-item";

import "./template-item.component.less";
import { useMount } from "react-use";

interface IWaitComponentProps extends IComponentProps<WaitItem> {}
const WaitItemComponent = (props: IWaitComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMount(() => {
    props.data.onRefInit(ref);
  });

  return <></>;
};

export const render = (data: WaitItem) => {
  return <WaitItemComponent data={data}></WaitItemComponent>;
};
