import React, { useContext } from "react";
import { Menu, Tag, Intent } from "@blueprintjs/core";

import { CreatorContext } from "../../hooks/context";
import {
  BundlesManager,
  BundleType
} from "../../../common/services/bundles-manager/bundles-manager";
import { GUIToaster } from "../../common/toaster";
import { DBProjects } from "../../common/remote-objects/remote-database";

export const ProjectDetailContextMenu = () => {
  const { state, dispatch } = useContext(CreatorContext);

  const updateEngine = async (newEngineHash: string) => {
    await DBProjects.update(
      { _id: state.openedProject?._id },
      {
        $set: {
          engineHash: newEngineHash
        }
      }
    );

    if (state.openedProject) {
      state.openedProject.engineHash = newEngineHash;
    }

    GUIToaster.show({
      message: "更改引擎成功，重启游戏客户端后生效。",
      timeout: 800
    });
  };

  const engines = () => {
    const bundles = Array.from(BundlesManager.localBundles.values());

    const engineBundles = bundles.filter((v) => {
      return v.bundleInfo.type === BundleType.Engine;
    });

    return engineBundles.map((v) => {
      return (
        <Menu.Item
          key={v.hash}
          onClick={async () => {
            await updateEngine(v.hash);
          }}
          text={
            <>
              {v.bundleInfo.name}
              {state.openedProject?.engineHash === v.hash && (
                <>
                  {" "}
                  <Tag intent={Intent.SUCCESS}>当前</Tag>
                </>
              )}
            </>
          }
        ></Menu.Item>
      );
    });
  };

  return (
    <Menu>
      <Menu.Item key="engine" text="引擎版本">
        {engines()}
      </Menu.Item>
    </Menu>
  );
};
