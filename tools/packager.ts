import * as path from "path";
import * as fs from "fs-extra";
import * as builder from "electron-builder";
import * as PackageJson from "../package.json";
import * as SemVer from "semver";
import * as program from "commander";

program
  .option(
    "-v, --version-tag [versionTag]",
    "发布的版本，在不同的版本标记上递增"
  )
  .description(
    `可选： major, premajor, minor, preminor, patch, prepatch, prerelease`
  )
  .option("-i, --identifier [identifier]", "版本后缀", "beta")

  .option(
    "-D, --dev-package [isDevPackage]",
    "是否用于测试的打包（不递增版本号）",
    false
  );

if (!program.versionTag) {
  program.versionTag = "prepatch";
}

const updateVersion = async () => {
  const PackageFile = path.resolve(__dirname, "../package.json");

  let packageInfo = PackageJson;
  const originalVersion = `v${packageInfo.version}`;

  const newVersion = SemVer.inc(
    packageInfo.version,
    program.versionTag,
    program.identifier
  );

  if (newVersion) {
    console.log(`[!] 更新版本信息 ... ${originalVersion} => ${newVersion}`);

    packageInfo.version = newVersion;
    fs.writeJSONSync(PackageFile, packageInfo, { spaces: 2 });
  }
};

const build = async () => {
  const Platform = builder.Platform;

  // 构建
  await builder.build({
    targets: Platform.current().createTarget(),
    config: {
      productName: "AVGPlusCreator", //项目名 这也是生成的exe文件的前缀名
      appId: "com.avgplus.creator", //包名
      buildVersion: PackageJson.version,
      directories: {
        app: "./",
        output: "build"
      },
      files: ["dist/**/*"],
      asar: true,
      mac: {
        identity: null, // 不签名
        hardenedRuntime: true,
        icon: "pack-data/icons/icon_512x512@2x.png",
        target: ["dir", "dmg"]
      },
      nsis: {
        oneClick: false,
        perMachine: true,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        runAfterFinish: true
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

if (!program.isDevPackage) {
  updateVersion();
}
