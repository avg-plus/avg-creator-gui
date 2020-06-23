import { Env } from "./../../../common/env";
import fs from "fs-extra";
import url from "url";
import path from "path";
import got, { Progress } from "got";
import urljoin from "url-join";

enum BundleType {
  Template = "template",
  Engine = "engine"
}

export interface IBundle {
  path: string;
  hash: string;
  type: BundleType;
}

export interface ITemplteBundle extends IBundle {
  name: string;
}

export interface IEngineBundle extends IBundle {
  platform: string;
}

export interface IBundleManifest {
  domain: string;
  project_templates: Array<ITemplteBundle>;
  engines: Array<IEngineBundle>;
}

export class BundlesManager {
  static async fetchManifest() {
    console.log("Fetching manifest ...");
    const manifest = await got.get<IBundleManifest>(
      "https://static.avg-engine.com/manifest.json",
      {
        responseType: "json"
      }
    );

    // 保存配置到本地
    const saveDir = Env.getAppDataDir();
    fs.writeJSONSync(path.join(saveDir, "manifest.json"), manifest.body);

    return {
      domain: "https://static.avg-engine.com/",
      project_templates: [
        // {
        //   type: "template",
        //   path: "project-templates/default.zip",
        //   hash: "150db4614da2b6313695bdd9b083b0d1"
        // }
      ],
      engines: [
        // {
        //   "type": "engine",
        //   "path": "engines/AVGPlus-browser-v0.1.24_alpha.zip",
        //   "hash": "18353ddc55cbca4db85800f361f78317"
        // },
        {
          type: "engine",
          path: "test/large-test.zip",
          hash: "18353ddc55cbca4db85800f361f78317",
          platform: "browser"
        }
      ]
    };

    //manifest.body;
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
    const fetchConfig = await this.fetchManifest();
    const domain = fetchConfig.domain;

    const bundles: Array<IBundle> = [
      ...fetchConfig.engines,
      ...fetchConfig.project_templates
    ];

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
        bundle.type === BundleType.Engine
          ? Env.getAVGEngineBundleDir()
          : Env.getAVGProjectTemplateDir();

      if (parsed.pathname) {
        fs.writeFileSync(
          path.join(saveDirectory, path.basename(parsed.pathname)),
          response.rawBody
        );
      }
    }
  }
}
