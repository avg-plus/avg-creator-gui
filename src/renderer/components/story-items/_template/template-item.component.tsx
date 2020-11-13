import React, { useRef } from "react";
import { useMount } from "react-use";
import { IComponentProps } from "../component-props";
import { TemplateItem } from "./template-item";

import "./template-item.component.less";

interface ITemplateComponentProps extends IComponentProps<TemplateItem> {}
const TemplateItemComponent = (props: ITemplateComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMount(() => {
    props.item.onRefInit(ref);
  });

  return <></>;
};

export const render = (data: TemplateItem) => {
  return <TemplateItemComponent item={data}></TemplateItemComponent>;
};

export const renderExtendContextMenu = () => {
  return [];
};
