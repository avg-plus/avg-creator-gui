import classnames from "classnames";
import React, { useRef, useState } from "react";
import { useMount } from "react-use";
import { DialogueItem } from "./dialogue-item";

import "./dialogue-item.less";

interface IDialogueTextComponentProps {
  data: DialogueItem;
}

export const DialogueItemComponent = (props: IDialogueTextComponentProps) => {
  const [text, setText] = useState(props.data.getText());
  const ref = useRef<HTMLDivElement>(null);

  useMount(() => {
    props.data.onRefInit(ref);
  });

  const eventProps = {
    onInput: props.data.onChanged.bind(props.data),
    onKeyUp: props.data.onKeyUp.bind(props.data),
    onKeyDown: props.data.onKeyDown.bind(props.data)
  };

  return (
    <>
      <div
        ref={ref}
        {...eventProps}
        className={classnames("dialogue-item", "text")}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
    </>
  );
};
