import React, { useContext } from "react";

import path from "path";
import fs from "fs-extra";

import ReactMarkdown from "react-markdown";
import { Dialog } from "@blueprintjs/core";
import "./changelog-dialog.less";
import RootPath from "app-root-path";
import { CreatorContext } from "../../hooks/context";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";

export default () => {
  const { state, dispatch } = useContext(CreatorContext);

  const CHANGELOG = path.join(RootPath.path, "dist", "CHANGELOG.md");
  const content = fs.readFileSync(CHANGELOG).toString("utf8");

  const handleClose = () => {
    dispatch({
      type: AVGCreatorActionType.OpenChangeLogDialog,
      payload: {
        open: false
      }
    });
  };

  return (
    <Dialog
      title="更新日志"
      isOpen={state.isChangeLogDialogOpen}
      usePortal={true}
      hasBackdrop={false}
      onClose={handleClose}
      style={{ height: "90%", width: "80%" }}
      canOutsideClickClose={false}
      canEscapeKeyClose={true}
    >
      <div className="changelog-container text-selectable">
        <ReactMarkdown source={content} />
      </div>
    </Dialog>
  );
};
