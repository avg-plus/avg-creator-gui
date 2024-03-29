import * as Bundler from "parcel-bundler";
import * as path from "path";
import * as fs from "fs-extra";
import * as ParcelBundler from "parcel-bundler";

const outDir = "./dist";

function enumFiles(directory: string, ext: string): string[] {
  const filePaths: string[] = [];
  const directories = [directory];
  directories.forEach((curDir) => {
    const names = fs.readdirSync(curDir);
    names.forEach((name) => {
      if (!ext || !name.endsWith(ext)) {
        return;
      }

      filePaths.push(path.resolve(curDir, name));
    });
  });

  return filePaths;
}

async function copyFiles() {
  fs.copySync("./static/icons", `${outDir}/static/icons`);
  fs.copyFileSync("./CHANGELOG.md", `${outDir}/CHANGELOG.md`);
}

async function compileParcel(options = {}) {
  const entryFiles: string[] = [];

  // enum all static .html files
  const htmlFiles = enumFiles("./static", ".html");

  // Add to entries
  htmlFiles.map((v) => {
    entryFiles.push(v);
  });

  entryFiles.push(
    path.join(__dirname, "../src/main/preload.ts"),
    path.join(__dirname, "../src/main/remote/env.ts"),
    path.join(__dirname, "../src/main/remote/window-manager.ts"),
    path.join(__dirname, "../src/main/remote/local-app-config.ts"),
    path.join(__dirname, "../src/main/remote/database/db-project.ts"),
    path.join(__dirname, "../src/main/remote/database/db-resource.ts"),
    path.join(__dirname, "../src/main/remote/database/db-resourceType.ts"),
    path.join(__dirname, "../src/main/main.ts")
  );

  const bundlerOptions: ParcelBundler.ParcelOptions = {
    outDir, // The out directory to put the build files in, defaults to dist
    outFile: undefined, // The name of the outputFile
    publicUrl: "../", // The url to server on, defaults to dist
    watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
    cache: true, // Enabled or disables caching, defaults to true
    cacheDir: ".parcel-cache", // The directory cache gets put in, defaults to .cache
    contentHash: false, // Disable content hash from being included on the filename
    minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
    scopeHoist: false, // turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
    target: "electron", // browser/node/electron, defaults to browser
    // https: { // Define a custom {key, cert} pair, use true to generate one or false to use http
    //   cert: './ssl/c.crt', // path to custom certificate
    //   key: './ssl/k.key' // path to custom key
    // },
    logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
    hmr: true, // Enable or disable HMR while watching
    hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
    sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
    hmrHostname: "", // A hostname for hot module reload, default to ''
    detailedReport: true, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled,
    bundleNodeModules: false,
    ...options
  };

  const bundler = new Bundler(entryFiles, bundlerOptions);

  // Run the bundler, this returns the main bundle
  // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
  await bundler.bundle();
}

module.exports = {
  compileParcel
};

// 复制文件
copyFiles();

try {
  if (require.main === module) {
    const watch = process.argv.includes("--watch");
    compileParcel({ watch });
  }
} catch (error) {}
