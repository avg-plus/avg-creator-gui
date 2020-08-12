import React, { useContext } from "react";

import path from "path";
import fs from "fs-extra";

import ReactMarkdown from "react-markdown";
import { Dialog } from "@blueprintjs/core";
import RootPath from "app-root-path";
import { CreatorContext } from "../../hooks/context";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";

import "./changelog-dialog.less";
import Scrollbars from "react-custom-scrollbars";

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
      // backdropClassName={"changelog-backdrop"}
      usePortal={false}
      hasBackdrop={false}
      onClose={handleClose}
      className={"changelog-dialog"}
      canOutsideClickClose={false}
      canEscapeKeyClose={true}
    >
      <div className="changelog-container text-selectable">
        <Scrollbars style={{ height: "100%" }} autoHide autoHideTimeout={1000}>
          <ReactMarkdown source={content} />
        </Scrollbars>
      </div>
    </Dialog>
  );
};
