import React from "react";

import path from "path";
import fs from "fs-extra";

import ReactMarkdown from "react-markdown";
import { Dialog } from "@blueprintjs/core";
import "./changelog-dialog.less";
import RootPath from "app-root-path";

export const ChangeLogDialog = () => {
  const CHANGELOG = path.join(RootPath.path, "dist", "CHANGELOG.md");
  const content = fs.readFileSync(CHANGELOG).toString("utf8");

  return (
    <Dialog
      title="更新日志"
      isOpen={true}
      usePortal={true}
      hasBackdrop={false}
      style={{ height: "90%", width: "80%" }}
      canEscapeKeyClose={true}
    >
      <div className="changelog-container text-selectable">
        <ReactMarkdown source={content} />
      </div>
    </Dialog>
  );
};
