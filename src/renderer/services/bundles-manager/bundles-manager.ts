import { Env } from "./../../../common/env";
import got, { Progress } from "got";
import fs, { mkdirpSync } from "fs-extra";
import url from "url";
import path from "path";
import urljoin from "url-join";
import { apiGetManifest } from "../APIs/bundles-update-api";
import { logger } from "../../../common/lib/logger";
import glob from "glob";
import md5File from "md5-file";
import AdmZip from "adm-zip";

export enum BundleType {
  Engines = "engines",
  Templates = "project-templates"
}

export interface IBundle {
  type: BundleType;
  name: string;
  path: string;
  hash: string;
  time: number;
  size: number;
}

export interface ILocalBundle {
  bundleInfo: any;
  hash: string;
  filename: string;
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

export type OnUpdateCallback = (
  context: BundleDownloadContext,
  list: Array<IBundle>
) => void;

export class BundlesManager {
  private static manifest: any;
  static domain: string;

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

  static async loadLocalBundles() {
    const bundleDir = Env.getBundleDir();
    const files = glob.sync(`${bundleDir}/**/*.zip`, { nodir: true });

    const bundles = new Map<string, ILocalBundle>();
    for (const file of files) {
      const hash = await md5File(file);

      const zip = new AdmZip(file);
      const entry = zip.getEntry("bundle-info.json");

      if (entry) {
        const bundleInfo = JSON.parse(entry.getData().toString());
        bundles.set(hash, { hash, filename: file, bundleInfo });
      }
    }

    return bundles;
  }

  static async deleteLocalBundle(bundle: IBundle) {
    const saveDirectory =
      bundle.type === BundleType.Engines
        ? Env.getAVGEngineBundleDir()
        : Env.getAVGProjectTemplateDir();

    fs.removeSync(path.join(saveDirectory, path.basename(bundle.path)));
  }

  static async downloadBundle(bundle: IBundle, onUpdate: OnUpdateCallback) {
    const downloadURL = urljoin(this.domain, bundle.path);
    const response = await got(downloadURL, {
      cache: false
    }).on("downloadProgress", (progress) => {
      onUpdate && onUpdate({ bundle, progress }, [bundle]);
    });

    const parsed = url.parse(downloadURL);

    const saveDirectory =
      bundle.type === BundleType.Engines
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
}
