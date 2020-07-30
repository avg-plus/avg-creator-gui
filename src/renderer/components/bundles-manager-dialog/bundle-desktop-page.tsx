import React, { useState } from "react";
import os from "os";
import fs from "fs-extra";
import { NonIdealState, Button, Tag } from "@blueprintjs/core";
import { useMount } from "react-use";
import { BundlesManager } from "../../services/bundles-manager/bundles-manager";
import { LocalAppConfig } from "../../../common/local-app-config";
import { Env } from "../../../common/env";

export const BundleDesktopPage = () => {
  const [electronMirrors, setElectronMirrors] = useState<any>();
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [hasElectronMirror, setHasElectronMirror] = useState<boolean>(false);

  useMount(async () => {
    const mirrors = await BundlesManager.fetchElectronMirror();
    setElectronMirrors(mirrors);

    const desktopShellConfig = LocalAppConfig.get("desktopShell");
    if (desktopShellConfig && desktopShellConfig.filename) {
      if (fs.existsSync(desktopShellConfig.filename)) {
        setHasElectronMirror(true);
      }
    }
  });

  const handleDownload = async () => {
    await BundlesManager.downloadElectronMirror(
      electronMirrors[os.platform()],
      (context) => {
        console.log(context);

        setDownloadProgress(context.progress.percent);
        setHasElectronMirror(false);
        setDownloading(true);

        if (context.progress.percent >= 1) {
          // 保存配置
          LocalAppConfig.set("desktopShell", {
            SHA256: context.bundle.SHA256,
            filename: context.filename
          });
          LocalAppConfig.save(() => {
            setDownloading(false);
            setHasElectronMirror(true);
          });
        }
      }
    );
  };

  const handleDelete = () => {
    const desktopShellConfig = LocalAppConfig.get("desktopShell");
    if (desktopShellConfig && desktopShellConfig.filename) {
      fs.removeSync(desktopShellConfig.filename);
    }

    LocalAppConfig.clear("desktopShell");
    LocalAppConfig.save(() => {
      setHasElectronMirror(false);
      setDownloading(false);
      setDownloadProgress(0);
    });
  };

  return (
    <div style={{ height: "50%" }}>
      <NonIdealState
        icon={"desktop"}
        title="桌面端启动器"
        description={
          <>
            <div className={"bp3-ui-text"}>
              要支持在桌面平台以独立的窗口应用程序的形式运行游戏，需要下载额外的启动器支持。
            </div>
            <p></p>
            <div>
              当前操作系统：<Tag>{Env.getOSName()}</Tag>
            </div>
          </>
        }
        action={
          <>
            <div>
              {!hasElectronMirror && (
                <Button
                  icon="download"
                  disabled={downloading}
                  onClick={handleDownload}
                >
                  {downloading && (
                    <>正在下载 {(downloadProgress * 100).toFixed(0)}%</>
                  )}

                  {!downloading && <>开始下载</>}
                </Button>
              )}

              {hasElectronMirror && (
                <Button icon="delete" intent={"danger"} onClick={handleDelete}>
                  删除
                </Button>
              )}
            </div>
          </>
        }
      />
    </div>
  );
};
