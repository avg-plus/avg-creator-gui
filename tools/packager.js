module.exports = {
  productName: "AVGPlus Creator", //项目名 这也是生成的exe文件的前缀名
  appId: "com.avgplus.creator", //包名
  directories: {
    app: "./",
    output: "build"
  },
  files: ["dist/**/*"],
  asar: true,
  mac: {
    identity: null, // 不签名
    hardenedRuntime: true,
    icon: "tools/icons/icon_512x512@2x.png",
    target: ["dir"]
  },
  win: {
    icon: "tools/icons/icon_512x512@2x.png",
    target: [
      {
        target: "squirrel",
        arch: ["x64"]
      },
      {
        target: "zip",
        arch: ["x64"]
      }
    ]
  }
};
