import React from "react";
import { Dialog } from "@blueprintjs/core";

export const UpdateDialog = () => {
  return (
    <Dialog
      title="版本更新"
      isOpen={true}
      usePortal={true}
      hasBackdrop={false}
      style={{ height: "90%", width: "80%" }}
      canEscapeKeyClose={true}
    ></Dialog>
  );
};
