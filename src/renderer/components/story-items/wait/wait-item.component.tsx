import React, { useRef, useState } from "react";
import { Button, EditableText } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import { IComponentProps } from "../component-props";
import { WaitItem } from "./wait-item";

import "./wait-item.component.less";
import { useMount } from "react-use";
import _ from "underscore";
import { FlatButton } from "../../../controls/flat-button/index.component";
import { MenuSelect } from "../../../controls/menu-select/index.component";

interface IWaitComponentProps extends IComponentProps<WaitItem> {}
interface IMenuSelectWaitTimes {
  title: string;
}
const WaitItemComponent = (props: IWaitComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [oldValue, setOldValue] = useState(props.item.time);
  const [waitTime, setWaitTime] = useState(oldValue);

  useMount(() => {
    props.item.onRefInit(ref);
  });

  return (
    <>
      延时{" "}
      <MenuSelect<IMenuSelectWaitTimes>
        displayField={"title"}
        items={[{ title: "1111" }, { title: "2222" }]}
      ></MenuSelect>
      <EditableText
        type={"number"}
        selectAllOnFocus={true}
        multiline={false}
        defaultValue={waitTime.toString()}
        value={waitTime.toString()}
        onChange={(value: string) => {
          if (value.length > 5) {
            value = "86400";
          }
          const v = +value;
          setWaitTime(v);
        }}
        onConfirm={(value: string) => {
          let v = +value;

          // 此处允许零秒，为了方便的时候临时设为0进行调试
          if (v <= 0) {
            v = 0;
          }

          if (v > 3600 * 24) {
            v = 3600 * 24;
          }

          // 延时不能大于一天
          setWaitTime(v);
          setOldValue(v);
          props.item.time = v;
        }}
        onCancel={(value: string) => {
          setWaitTime(oldValue);
          props.item.time = oldValue;
        }}
      />
      秒
    </>
  );
};

export const render = (data: WaitItem) => {
  return <WaitItemComponent item={data}></WaitItemComponent>;
};
