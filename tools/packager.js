module.exports = {
  "productName": "AVGPlus Creator",//项目名 这也是生成的exe文件的前缀名
  "appId": "com.avgplus.creator",//包名  
  "directories": {
    "output": "build"
  },
  "files": [
    "dist/"
  ],
  "asar": true,
  "mac": {
    "icon": "build/icons/icon.icns",
    target: ["zip"]
  },
  "win": {
    "icon": "build/icons/aims.ico",
    "target": [
      {
        "target": "nsis",
        "arch": [
          "ia32"
        ]
      }
    ]
  },
  "linux": {
    "icon": "build/icons"
  }
}