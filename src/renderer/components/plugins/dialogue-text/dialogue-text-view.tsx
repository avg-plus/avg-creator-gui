import React, { useState } from "react";
import { Tag } from "@blueprintjs/core";
import classnames from "classnames";

import "./dialogue-text.less";
import { toHTMLElement } from "../../../../common/dom-utils";

interface IDialogueTextComponentProps {
  block: string;
}

const DialogueTextComponent = (props: IDialogueTextComponentProps) => {
  return (
    <div
      className={classnames("text-content", "ce-paragraph", props.block)}
      contentEditable={true}
    ></div>
  );
};

export class DialogueTextView {
  render(api: EditorJS.API) {
    return toHTMLElement(
      "div",
      <DialogueTextComponent block={api.styles.block} />
    );
  }
}
