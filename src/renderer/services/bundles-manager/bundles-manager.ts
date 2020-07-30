import { Env } from "./../../../common/env";
import got, { Progress } from "got";
import fs, { mkdirpSync } from "fs-extra";
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
    const manifest = await apiGetManifest<IBundleManifest>();

    logger.info("response", manifest);

    // 保存配置到本地
    const saveDir = Env.getAppDataDir();
    fs.writeJSONSync(path.join(saveDir, "manifest.json"), manifest);

    BundlesManager.manifest = manifest;
    BundlesManager.domain = manifest.domain;

    return manifest;
  }

  static async fetchElectronMirror() {
    const mirrors = await apiGetElectronMirror();

    console.log("mirrors", mirrors);

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

    console.log("Load local bundles : ", this.localBundles);

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

    mkdirpSync(saveDirectory);

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
    mkdirpSync(saveDirectory);

    const filename = path.join(saveDirectory, path.basename(parsed.pathname));

    const response = await got(downloadURL, {
      cache: false,
      rejectUnauthorized: false
    }).on("downloadProgress", (progress) => {
      onUpdate && onUpdate({ bundle: mirror, progress, filename });
    });

    fs.writeFileSync(filename, response.rawBody);
  }

  static extractDesktopMirror(filename: string) {}
}
