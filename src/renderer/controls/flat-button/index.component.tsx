import React from "react";
import { Button, IButtonProps } from "@blueprintjs/core";

import "./index.less";

interface IFlatButtonProps extends IButtonProps {
  width?: number | string;
}

export const FlatButton = (props: IFlatButtonProps) => {
  return (
    <Button
      className={`${props.className} flat-button`}
      style={{ width: props.width ?? "auto" }}
      {...props}
    />
  );
};
