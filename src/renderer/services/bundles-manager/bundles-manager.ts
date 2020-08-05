import { Env } from "./../../../common/env";
import got, { Progress } from "got";
import fs from "fs-extra";

import extract from "extract-zip";

import child_process from "child_process";
import url from "url";
import path from "path";
import urljoin from "url-join";
import {
  apiGetManifest,
  apiGetElectronMirror
} from "../APIs/bundles-update-api";
import { logger } from "../../../common/lib/logger";
import glob from "glob";
import md5File from "md5-file";
import AdmZip from "adm-zip";
import { remote } from "electron";
import { EnginePlatform } from "../../../common/engine-platform";
import { LocalAppConfig } from "../../../common/local-app-config";
import { GUIToaster } from "../toaster";

export enum BundleType {
  Engine = "engine",
  Template = "template",
  Desktop = "desktop"
}

export interface BundleInfo {
  type: BundleType;
  name: string;
  description: string;
  // filename: string;
  version: string;
}

export interface IBundle {
  type: BundleType;
  name: string;
  path: string;
  hash: string;
  time: number;
  size: number;
}

export interface IElectronMirrorBundle {
  URL: string;
  SHA256: string;
}

export interface ILocalBundle {
  bundleInfo: BundleInfo;
  filename: string;
  hash: string;
}

export interface IBundleManifest {
  domain: string;
  bundles: Array<IBundle>;
}

export interface BundleDownloadContext {
  index?: number;
  bundle: IBundle;
  progress: Progress;
}

export interface ElectronBundleDownloadContext {
  bundle: IElectronMirrorBundle;
  filename: string;
  progress: Progress;
}

export type OnBundleUpdateCallback = (
  context: BundleDownloadContext,
  list: Array<IBundle>
) => void;

export type OnElectronMirrorUpdateCallback = (
  context: ElectronBundleDownloadContext
) => void;

export class BundlesManager {
  private static manifest: any;
  static domain: string;
  static localBundles = new Map<string, ILocalBundle>();

  static async fetchManifest() {
    try {
      const manifest = await apiGetManifest<IBundleManifest>();

      logger.debug("response", manifest);

      // 保存配置到本地
      const saveDir = Env.getAppDataDir();
      fs.writeJSONSync(path.join(saveDir, "manifest.json"), manifest);

      BundlesManager.manifest = manifest;
      BundlesManager.domain = manifest.domain;

      return manifest;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async fetchElectronMirror() {
    const mirrors = await apiGetElectronMirror();

    logger.debug("mirrors", mirrors);

    return mirrors;
  }

  static async loadLocalBundles() {
    this.localBundles.clear();
    const bundleDir = Env.getBundleDir();
    const files = glob.sync(`${bundleDir}/**/*.zip`, { nodir: true });

    for (const file of files) {
      const hash = await md5File(file);

      const zip = new AdmZip(file);
      const entry = zip.getEntry("bundle-info.json");

      if (entry) {
        const bundleInfo = JSON.parse(entry.getData().toString());
        this.localBundles.set(hash, {
          hash,
          filename: file,
          bundleInfo
        });
      }
    }

    logger.debug("Load local bundles : ", this.localBundles);

    return this.localBundles;
  }

  static getLocalBundleByHash(hash: string) {
    return this.localBundles.get(hash);
  }

  static async deleteLocalBundle(bundle: IBundle) {
    const saveDirectory =
      bundle.type === BundleType.Engine
        ? Env.getAVGEngineBundleDir()
        : Env.getAVGProjectTemplateDir();

    fs.removeSync(path.join(saveDirectory, path.basename(bundle.path)));

    this.loadLocalBundles();
  }

  static async downloadBundle(
    bundle: IBundle,
    onUpdate: OnBundleUpdateCallback
  ) {
    const downloadURL = urljoin(this.domain, bundle.path);
    const response = await got(downloadURL, {
      cache: false,
      rejectUnauthorized: false
    }).on("downloadProgress", (progress) => {
      onUpdate && onUpdate({ bundle, progress }, [bundle]);
    });

    const parsed = url.parse(downloadURL);

    const saveDirectory =
      bundle.type === BundleType.Engine
        ? Env.getAVGEngineBundleDir()
        : Env.getAVGProjectTemplateDir();

    fs.mkdirpSync(saveDirectory);

    if (parsed.pathname) {
      fs.writeFileSync(
        path.join(saveDirectory, path.basename(parsed.pathname)),
        response.rawBody
      );
    }
  }

  static async downloadElectronMirror(
    mirror: IElectronMirrorBundle,
    onUpdate: OnElectronMirrorUpdateCallback
  ) {
    const downloadURL = mirror.URL;

    const parsed = url.parse(downloadURL);
    if (!parsed || !parsed.pathname) {
      return;
    }

    const saveDirectory = Env.getElectronMirrorBundleDir();
    fs.mkdirpSync(saveDirectory);

    const filename = path.join(saveDirectory, path.basename(parsed.pathname));

    const response = await got(downloadURL, {
      cache: false,
      rejectUnauthorized: false
    }).on("downloadProgress", (progress) => {
      onUpdate && onUpdate({ bundle: mirror, progress, filename });
    });

    fs.writeFileSync(filename, response.rawBody);
  }

  static getLocalEngineDir(engineHash: string, platform: EnginePlatform) {
    // 查找引擎 package
    const bundle = BundlesManager.getLocalBundleByHash(engineHash);
    if (!bundle) {
      throw new Error("读取 AVGPlus Core 失败，请确认对应的 Engine 数据存在。");
    }

    const engineTemp = path.join(remote.app.getPath("temp"), engineHash);
    if (fs.existsSync(engineTemp)) {
      return path.join(engineTemp, "bundle", platform as string);
    }

    // TODO: 这里柔和处理一下，不删除，因为临时目录下的文件大概率不会被手动修改
    // fs.removeSync(engineTemp);

    // 解压引擎
    const zip = new AdmZip(bundle.filename);
    zip.extractAllTo(engineTemp, true);

    return path.join(engineTemp, "bundle", platform as string);
  }

  static async getElectronExecutable() {
    const desktopShellConfig = LocalAppConfig.get("desktopShell");
    if (!desktopShellConfig || !desktopShellConfig.SHA256) {
      throw new Error("调试游戏失败，无法找到桌面端启动器。");
    }

    const win32Executable = "electron.exe";
    const macOSExecutable = "Electron.app/Contents/MacOS/Electron";

    const electronTemp = path.join(
      remote.app.getPath("temp"),
      desktopShellConfig.SHA256
    );

    let executablePath = "";
    if (Env.getOSName() === "MacOS") {
      executablePath = path.join(electronTemp, macOSExecutable);
    } else {
      executablePath = path.join(electronTemp, win32Executable);
    }

    if (fs.existsSync(electronTemp) && fs.existsSync(executablePath)) {
      return executablePath;
    }

    // 解压
    if (
      !desktopShellConfig.filename ||
      !fs.existsSync(desktopShellConfig.filename)
    ) {
      return null;
    }

    // bug refer: https://stackoverflow.com/questions/43645745/electron-invalid-package-on-unzip
    process.noAsar = true;
    await extract(desktopShellConfig.filename, { dir: electronTemp });
    process.noAsar = false;

    return executablePath;
  }
}
