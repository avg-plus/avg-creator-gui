import React, { useRef, useState } from "react";
import { EditableText } from "@blueprintjs/core";

import { IComponentProps } from "../component-props";
import { WaitItem } from "./wait-item";

import "./wait-item.component.less";
import { useMount } from "react-use";
import _ from "underscore";

interface IWaitComponentProps extends IComponentProps<WaitItem> {}
const WaitItemComponent = (props: IWaitComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [oldValue, setOldValue] = useState(props.data.time);
  const [waitTime, setWaitTime] = useState(oldValue);

  useMount(() => {
    props.data.onRefInit(ref);
  });

  return (
    <>
      延时{" "}
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
          props.data.time = v;
        }}
        onCancel={(value: string) => {
          setWaitTime(oldValue);
          props.data.time = oldValue;
        }}
      />
      秒
    </>
  );
};

export const render = (data: WaitItem) => {
  return <WaitItemComponent data={data}></WaitItemComponent>;
};
