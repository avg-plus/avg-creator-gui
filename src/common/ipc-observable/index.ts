if (process.type === "renderer") {
  module.exports.ipcObservableRenderer = require("./ipc-observable-renderer");
} else {
  module.exports.ipcObservableMain = require("./ipc-observable-main");
}
