import React, { useContext } from "react";
import { Alert, Intent, Tab, Tag } from "@blueprintjs/core";
import { CreatorContext } from "../../hooks/context";
import { GUIToaster } from "../../services/toaster";
import { remote } from "electron";
import SemVer from "semver";

export default () => {
  const { state, dispatch } = useContext(CreatorContext);

  // if (item) {
  //   GUIToaster.show({
  //     message: `检测到船新版本 ${item.version}，要更新吗？`,
  //     timeout: 3000
  //   });
  // }

  let shouldUpdate = false;
  let imcommingVersion = "";
  let currentVersion = "";
  const updateItem = state.checkUpdateAlert.updateItem;

  if (updateItem) {
    imcommingVersion = updateItem.version;
    currentVersion = remote.app.getVersion();
    if (imcommingVersion && currentVersion) {
      if (SemVer.compare(imcommingVersion, currentVersion)) {
        shouldUpdate = true;
      }
    }
  }

  const renderDescriptions = (descriptions: string[]) => {
    console.log("renderDescriptions", descriptions);

    return descriptions.map((v) => {
      return <div>{v}</div>;
    });
  };

  return (
    <Alert
      cancelButtonText={shouldUpdate ? "暂不更新" : ""}
      isOpen={state.checkUpdateAlert.open}
      canEscapeKeyCancel={true}
      icon={"automatic-updates"}
      intent={Intent.PRIMARY}
      confirmButtonText={shouldUpdate ? "开始下载更新" : "好的"}
      onClose={() => {}}
    >
      {updateItem && shouldUpdate && (
        <>
          <div>
            <h3>有新的可用版本！</h3>
          </div>
          <div>当前版本：v{currentVersion}</div>
          <div>
            最新版本：v{imcommingVersion}{" "}
            <Tag minimal={true} intent={"danger"}>
              NEW
            </Tag>
          </div>
          <div> 发布时间：{updateItem?.time}</div>
          {updateItem.descriptions && updateItem.descriptions.length && (
            <>
              <br />
              <h4>更新内容：</h4>
              {renderDescriptions(updateItem.descriptions || [])}
            </>
          )}
        </>
      )}
    </Alert>
  );
};
