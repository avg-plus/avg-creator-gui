import * as builder from "electron-builder";
import * as PackageJson from "../package.json";

const Platform = builder.Platform;

const build = async () => {
  await builder.build({
    targets: Platform.MAC.createTarget(),
    config: {
      productName: "AVGPlus Creator", //项目名 这也是生成的exe文件的前缀名
      appId: "com.avgplus.creator", //包名
      buildVersion: PackageJson.version,
      directories: {
        app: "./",
        output: "build"
      },
      files: ["dist/**/*"],
      asar: false,
      mac: {
        identity: null, // 不签名
        hardenedRuntime: true,
        icon: "pack-data/icons/icon_512x512@2x.png",
        target: ["dir", "dmg"]
      },
      win: {
        icon: "pack-data/icons/icon_512x512@2x.png",
        target: [
          {
            target: "nsis",
            arch: ["x64"]
          },
          {
            target: "zip",
            arch: ["x64"]
          }
        ]
      }
    }
  });
};

build();
