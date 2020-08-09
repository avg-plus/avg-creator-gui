import React, { useContext } from "react";

import os from "os";

import { Alert, Intent, Text } from "@blueprintjs/core";
import { CreatorContext } from "../../hooks/context";
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions";
import { remote } from "electron";

export default () => {
  const { state, dispatch } = useContext(CreatorContext);

  return (
    <Alert
      confirmButtonText="好的"
      isOpen={state.isAboutDialogOpen}
      canEscapeKeyCancel={true}
      icon={"info-sign"}
      intent={Intent.PRIMARY}
      onClose={() => {
        dispatch({
          type: AVGCreatorActionType.OpenAboutDialog,
          payload: {
            open: false
          }
        });
      }}
    >
      {/* <Text className={"text-selectable"}>
        版本: {remote.app.getVersion() }
        Electron: {process.versions.electron} <br />
        Chrome: {process.versions.chrome} <br />
        Node.js: {process.versions.node}
        <br />
        操作系统: {os.platform()} {os.arch()} <br />
      </Text> */}
      <div className={"text-selectable"}>
        <div>版本: {remote.app.getVersion()}</div>
        <div>Electron: {process.versions.electron}</div>
        <div>Chrome: {process.versions.chrome}</div>
        <div>Node.js: {process.versions.node}</div>
        <div>
          操作系统: {os.platform()} {os.arch()} {}
        </div>
      </div>
    </Alert>
  );
};
