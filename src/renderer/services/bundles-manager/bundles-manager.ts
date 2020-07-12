import { Env } from "./../../../common/env";
import got, { Progress } from "got";
import fs, { mkdirpSync } from "fs-extra";
import url from "url";
import path from "path";
import urljoin from "url-join";
import { apiGetManifest } from "../APIs/bundles-update-api";
import { logger } from "../../../common/lib/logger";

// export enum BundleType {
//   Template = "template",
//   Engine = "engine"
// }

export enum BundleType {
  Engines = "engines",
  Templtes = "project-templates"
}

export interface IBundle {
  type: BundleType;
  path: string;
  hash: string;
  time: number;
  size: number;
}

export interface IBundleManifest {
  domain: string;
  bundles: Array<IBundle>;
}

export class BundlesManager {
  static async fetchManifest() {
    const manifest = await apiGetManifest<IBundleManifest>();

    logger.info("response", manifest);

    // 保存配置到本地
    const saveDir = Env.getAppDataDir();
    fs.writeJSONSync(path.join(saveDir, "manifest.json"), manifest);

    return manifest;
  }

  static async checkingBundles(
    onUpdate: (
      current: {
        index: number;
        bundle: IBundle;
        progress: Progress;
      },
      list: Array<IBundle>
    ) => void
  ) {
    const fetchData = await this.fetchManifest();

    const domain = fetchData.domain;
    const bundles = fetchData.bundles;

    for (let i = 0; i < bundles.length; ++i) {
      const bundle = bundles[i];
      const downloadURL = urljoin(domain, bundle.path);
      const response = await got(downloadURL, {
        cache: false
      }).on("downloadProgress", (progress) => {
        onUpdate && onUpdate({ bundle, progress, index: i }, bundles);
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
}
