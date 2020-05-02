process.env.HMR_PORT=62145;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error;
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;

},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;

},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../src/renderer/App.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/renderer/easy_creator/components/ProjectListItem.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/renderer/easy_creator/components/ProjectListItem.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectListItem = void 0;

var _tslib = require("tslib");

var _react = _interopRequireDefault(require("react"));

require("./ProjectListItem.less");

var _antd = require("antd");

var _core = require("@blueprintjs/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @format */
var ProjectListItem =
/** @class */
function (_super) {
  (0, _tslib.__extends)(ProjectListItem, _super);

  function ProjectListItem() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ProjectListItem.prototype.render = function () {
    return _react.default.createElement("div", {
      className: "project-list-item"
    }, _react.default.createElement(_antd.Row, {
      align: "middle",
      justify: "start"
    }, _react.default.createElement(_antd.Col, {
      span: 6
    }, _react.default.createElement("div", {
      className: "cover-image"
    })), _react.default.createElement(_antd.Col, {
      span: 12
    }, _react.default.createElement(_antd.Row, {
      justify: "start"
    }, _react.default.createElement("div", {
      className: "title"
    }, this.props.name)), _react.default.createElement(_antd.Row, {
      justify: "start"
    }, _react.default.createElement("div", {
      className: "description"
    }, this.props.description)))));
  };

  ProjectListItem.prototype.renderContextMenu = function (e) {
    return _react.default.createElement(_core.Menu, null, _react.default.createElement(_core.Menu.Item, {
      icon: "label",
      text: "\u8FD0\u884C"
    }, _react.default.createElement(_core.Menu.Item, {
      icon: "globe-network",
      text: "\u6D4F\u89C8\u5668"
    }), _react.default.createElement(_core.Menu.Item, {
      icon: "desktop",
      text: "PC \u684C\u9762"
    })), _react.default.createElement(_core.Menu.Divider, null), _react.default.createElement(_core.Menu.Item, {
      icon: "trash",
      intent: "danger",
      text: "\u6253\u5F00\u9879\u76EE\u76EE\u5F55"
    }), _react.default.createElement(_core.Menu.Divider, null), _react.default.createElement(_core.Menu.Item, {
      icon: "trash",
      intent: "danger",
      text: "\u5220\u9664\u9879\u76EE"
    }), _react.default.createElement(_core.Menu.Divider, null), _react.default.createElement(_core.Menu.Item, {
      icon: "cog",
      text: "\u8BBE\u7F6E"
    }));
  };

  ProjectListItem = (0, _tslib.__decorate)([_core.ContextMenuTarget], ProjectListItem);
  return ProjectListItem;
}(_react.default.PureComponent);

exports.ProjectListItem = ProjectListItem;
},{"./ProjectListItem.less":"../src/renderer/easy_creator/components/ProjectListItem.less"}],"../src/renderer/easy_creator/components/AVGCreatorPortal.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/renderer/easy_creator/components/ProjectListMainPanel.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/renderer/easy_creator/components/ProjectSettingPanel.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/renderer/easy_creator/components/ProjectSettingPanel.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectSettingPanel = void 0;

var _tslib = require("tslib");

var _react = _interopRequireWildcard(require("react"));

var _core = require("@blueprintjs/core");

require("./ProjectSettingPanel.less");

var _antd = require("antd");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @format */
var SettingPanelTabID;

(function (SettingPanelTabID) {
  SettingPanelTabID["BasePanel"] = "base-panel";
  SettingPanelTabID["GamePanel"] = "game-panel";
  SettingPanelTabID["AdvancedPanel"] = "advanced-panel";
})(SettingPanelTabID || (SettingPanelTabID = {}));

var handleTabChange = function (navbarTabId) {// this.setState({
  //   selectedTab: navbarTabId,
  // });
};

var BaseSettingPanel = function (_a) {
  // const currentProject = store.getState().AVGCreatorReducer.data.project;
  var project = _a.project;
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_core.FormGroup, {
    helperText: "\u6E38\u620F\u9879\u76EE\u7684\u540D\u5B57\uFF0C\u5165\u300C\u767D\u8272\u76F8\u7C3F2\u300D",
    label: "\u9879\u76EE\u540D\u79F0",
    labelFor: "project-name-input",
    labelInfo: "(*)"
  }, _react.default.createElement(_core.InputGroup, {
    id: "project-name-input",
    defaultValue: project.name
  })), _react.default.createElement(_core.FormGroup, {
    helperText: "\u4E3A\u6E38\u620F\u9879\u76EE\u5199\u4E00\u4E2A\u7B80\u77ED\u7684\u8BF4\u660E",
    label: "\u63CF\u8FF0",
    labelFor: "project-description-input"
  }, _react.default.createElement(_core.InputGroup, {
    className: "dir-path-input",
    id: "project-description-input",
    defaultValue: project.description
  })), _react.default.createElement(_core.FormGroup, {
    helperText: "\u6E38\u620F\u9879\u76EE\u7684\u76EE\u5F55\u8DEF\u5F84",
    label: "\u9879\u76EE\u76EE\u5F55",
    labelFor: "project-dir-input"
  }, _react.default.createElement(_core.FileInput, {
    id: "project-dir-input",
    buttonText: "\u9009\u62E9\u76EE\u5F55",
    text: "\u9009\u62E9\u6E38\u620F\u9879\u76EE\u76EE\u5F55"
  })));
};

var AdvancedSettingPanel = function (_a) {
  var project = _a.project;
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_core.FormGroup, {
    label: _react.default.createElement("label", null, "\u76D1\u542C\u5730\u5740"),
    labelFor: "project-name-input"
  }, _react.default.createElement(_core.InputGroup, {
    placeholder: "\u5982 http://localhost:2335",
    defaultValue: project.host
  }), _react.default.createElement(_core.Checkbox, {
    label: "\u81EA\u5B9A\u4E49"
  })));
};

var GameSettingPanel = function (project) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
    className: "form-group-line"
  }, _react.default.createElement("label", {
    className: "form-label"
  }, "\u6E38\u620F\u5206\u8FA8\u7387"), _react.default.createElement("div", {
    className: "controls-container"
  }, _react.default.createElement(_antd.Row, {
    gutter: 12
  }, _react.default.createElement(_antd.Col, {
    span: 12
  }, _react.default.createElement(_core.InputGroup, {
    rightElement: _react.default.createElement(_core.Tag, {
      minimal: true
    }, "\u5BBD"),
    small: true,
    defaultValue: project.screenWidth.toString()
  })), _react.default.createElement(_antd.Col, {
    span: 12
  }, _react.default.createElement(_core.InputGroup, {
    rightElement: _react.default.createElement(_core.Tag, {
      minimal: true
    }, "\u9AD8"),
    small: true,
    defaultValue: project.screenHeight.toString()
  }))))), _react.default.createElement("div", {
    className: "form-group-line"
  }, _react.default.createElement("div", {
    className: "controls-container"
  }, _react.default.createElement(_core.Checkbox, {
    label: "\u5168\u5C4F\u663E\u793A",
    checked: project.isFullScreen
  }))), _react.default.createElement("div", {
    className: "form-group-line"
  }, _react.default.createElement("label", {
    className: "form-label"
  }, "\u5BF9\u8BDD\u6587\u672C"), _react.default.createElement("div", {
    className: "controls-container"
  }, _react.default.createElement(_core.Slider, {
    min: 0,
    max: 100,
    stepSize: 1,
    labelStepSize: 1,
    value: project.textSpeed,
    vertical: false,
    labelRenderer: function (value) {
      if (value === 0) {
        return _react.default.createElement("div", {
          style: {
            wordBreak: "keep-all",
            marginLeft: "30px"
          }
        }, "\u975E\u5E38\u6162");
      } else if (value === 25) {
        return _react.default.createElement("p", null, "\u7A0D\u6162");
      } else if (value === 50) {
        return _react.default.createElement("p", null, "\u6B63\u5E38");
      } else if (value === 75) {
        return _react.default.createElement("p", null, "\u7A0D\u5FEB");
      } else if (value === 100) {
        return _react.default.createElement("div", {
          style: {
            wordBreak: "keep-all",
            marginRight: "30px"
          }
        }, "\u975E\u5E38\u5FEB");
      }

      return _react.default.createElement(_react.default.Fragment, null);
    }
  }))), _react.default.createElement("div", {
    className: "form-group-line"
  }, _react.default.createElement("div", {
    className: "controls-container"
  }, _react.default.createElement(_core.Checkbox, {
    label: "\u5BF9\u8BDD\u81EA\u52A8\u64AD\u653E",
    checked: project.autoPlay
  }))), _react.default.createElement("div", {
    className: "form-group-line"
  }, _react.default.createElement("label", {
    className: "form-label"
  }, "\u58F0\u97F3"), _react.default.createElement("div", {
    className: "controls-container"
  }, _react.default.createElement(_core.Slider, {
    min: 0,
    max: 100,
    stepSize: 1,
    labelStepSize: 10,
    value: project.volume,
    vertical: false
  }))));
};

var ProjectSettingPanel = function (_a) {
  var project = _a.project; // console.log("Load props ", props);

  var _b = (0, _react.useState)(project),
      p = _b[0],
      setProject = _b[1];

  return _react.default.createElement("div", {
    className: "setting-panel-container"
  }, _react.default.createElement(_core.Tabs, {
    id: "TabsExample",
    onChange: handleTabChange
  }, _react.default.createElement(_core.Tab, {
    id: SettingPanelTabID.BasePanel,
    title: "\u57FA\u672C",
    panel: BaseSettingPanel({
      project: project
    })
  }), _react.default.createElement(_core.Tab, {
    id: SettingPanelTabID.GamePanel,
    title: "\u521D\u59CB\u6E38\u620F\u8BBE\u7F6E",
    panel: GameSettingPanel(project),
    panelClassName: "ember-panel"
  }), _react.default.createElement(_core.Tab, {
    id: SettingPanelTabID.AdvancedPanel,
    title: "\u9AD8\u7EA7",
    panel: AdvancedSettingPanel({
      project: project
    }),
    panelClassName: "ember-panel"
  })), _react.default.createElement(_core.Button, {
    onClick: function () {
      project.name = "xxxx";
      setProject((0, _tslib.__assign)({}, project));
    }
  }, "\u4FDD\u5B58"));
};

exports.ProjectSettingPanel = ProjectSettingPanel;
},{"./ProjectSettingPanel.less":"../src/renderer/easy_creator/components/ProjectSettingPanel.less"}],"../src/renderer/easy_creator/manager/project-manager.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVGProjectManager = void 0;

var AVGProjectManager =
/** @class */
function () {
  function AVGProjectManager() {}

  AVGProjectManager.loadProjectList = function () {
    // 临时列表
    return [{
      name: "游戏 Demo",
      description: "明明是我先来……",
      dir: "dir/to/a/b/c",
      host: "localhost",
      listenPort: 2336,
      screenWidth: 800,
      screenHeight: 600,
      isFullScreen: true,
      textSpeed: 20,
      autoPlay: true,
      volume: 80
    }, {
      name: "白色相簿2",
      description: "明明是我先来……",
      dir: "dir/to/a/b/c",
      host: "localhost",
      listenPort: 2336,
      screenWidth: 1920,
      screenHeight: 1080,
      isFullScreen: false,
      textSpeed: 80,
      autoPlay: false,
      volume: 80
    }];
  };

  return AVGProjectManager;
}();

exports.AVGProjectManager = AVGProjectManager;
},{}],"../src/renderer/easy_creator/components/ProjectListMainPanel.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectListMainPanel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _ProjectListItem = require("./ProjectListItem");

require("./ProjectListMainPanel.less");

var _ProjectSettingPanel = require("./ProjectSettingPanel");

var _projectManager = require("../manager/project-manager");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @format */
var ProjectListMainPanel = function (_a) {
  var openPanel = _a.openPanel,
      closePanel = _a.closePanel;

  var _b = (0, _react.useState)(_projectManager.AVGProjectManager.loadProjectList()),
      projectList = _b[0],
      setProjectList = _b[1];

  var openSettingsPanel = function (project) {
    // const [p] = useState(project);
    openPanel({
      component: _ProjectSettingPanel.ProjectSettingPanel,
      props: {
        project: project
      },
      title: "设置"
    }); // store.dispatch(AVGCreatorAction.openSettingPanel(project));
  };

  return _react.default.createElement("div", {
    className: "list-container"
  }, projectList.length === 0 && _react.default.createElement(_antd.Empty, {
    image: "https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original",
    imageStyle: {
      height: 160
    },
    description: _react.default.createElement("div", {
      className: "empty-list-hint"
    }, "\u5450\uFF0C\u6682\u65F6\u6CA1\u6709\u9879\u76EE\u5462\uFF01")
  }, _react.default.createElement("button", {
    className: "bp3-button bp3-icon-add"
  }, "\u65B0\u5EFA\u9879\u76EE")), projectList.map(function (p) {
    return _react.default.createElement("div", {
      onDoubleClick: function () {
        openSettingsPanel(p);
      }
    }, _react.default.createElement(_ProjectListItem.ProjectListItem, {
      key: p.name,
      name: p.name,
      description: p.description
    }), " ");
  }), _react.default.createElement("div", {
    className: "running-status-info-bar"
  }, _react.default.createElement("p", {
    className: "info"
  }, "\u6B63\u5728\u76D1\u542C http://localhost:2335, \u70B9\u51FB\u6253\u5F00")));
};

exports.ProjectListMainPanel = ProjectListMainPanel;
},{"./ProjectListItem":"../src/renderer/easy_creator/components/ProjectListItem.tsx","./ProjectListMainPanel.less":"../src/renderer/easy_creator/components/ProjectListMainPanel.less","./ProjectSettingPanel":"../src/renderer/easy_creator/components/ProjectSettingPanel.tsx","../manager/project-manager":"../src/renderer/easy_creator/manager/project-manager.ts"}],"../src/renderer/redux/actions/avg-creator-actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVGCreatorActionType = void 0;
var AVGCreatorActionType;
exports.AVGCreatorActionType = AVGCreatorActionType;

(function (AVGCreatorActionType) {
  AVGCreatorActionType[AVGCreatorActionType["OpenSettingPanel"] = 0] = "OpenSettingPanel";
  AVGCreatorActionType[AVGCreatorActionType["CloseSettingPanel"] = 1] = "CloseSettingPanel";
})(AVGCreatorActionType || (exports.AVGCreatorActionType = AVGCreatorActionType = {})); // export class AVGCreatorAction {
//   static openSettingPanel(project: AVGProjectData) {
//     return {
//       type: AVGCreatorActionType.OpenSettingPanel,
//       data: {
//         project,
//         isSettingPanelOpen: true
//       }
//     };
//   }
//   static closeSettingPanel() {
//     return {
//       type: AVGCreatorActionType.CloseSettingPanel,
//       data: {
//         project: null,
//         isSettingPanelOpen: false
//       }
//     };
//   }
// }
},{}],"../src/renderer/redux/reducers/avg-creator-reducers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVGCreatorReducer = AVGCreatorReducer;
exports.AVGCreatorInitialState = void 0;

var _tslib = require("tslib");

var _avgCreatorActions = require("./../actions/avg-creator-actions");

var AVGCreatorInitialState = {
  isSettingPanelOpen: true,
  isShowPanelHeader: false,
  projects: [{
    key: "1",
    name: "白色相簿2",
    description: "明明是我先来……"
  }]
};
exports.AVGCreatorInitialState = AVGCreatorInitialState;

function AVGCreatorReducer(state, action) {
  switch (action) {
    case _avgCreatorActions.AVGCreatorActionType.OpenSettingPanel:
      return (0, _tslib.__assign)((0, _tslib.__assign)({}, state), {
        isSettingPanelOpen: true,
        isShowPanelHeader: true
      });

    case _avgCreatorActions.AVGCreatorActionType.CloseSettingPanel:
      return (0, _tslib.__assign)((0, _tslib.__assign)({}, state), {
        isSettingPanelOpen: false,
        isShowPanelHeader: false
      });

    default:
      throw new Error();
  }
}
},{"./../actions/avg-creator-actions":"../src/renderer/redux/actions/avg-creator-actions.ts"}],"../src/renderer/easy_creator/components/AVGCreatorPortal.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AVGCreatorPortal = void 0;

var React = _interopRequireWildcard(require("react"));

var _ProjectListItem = require("./ProjectListItem");

require("./AVGCreatorPortal.less");

var _antd = require("antd");

var _core = require("@blueprintjs/core");

var _ProjectListMainPanel = require("./ProjectListMainPanel");

var _avgCreatorReducers = require("../../redux/reducers/avg-creator-reducers");

var _avgCreatorActions = require("../../redux/actions/avg-creator-actions");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @format */
// export interface ProjectListState {
//   projects: any[]
//   isShowPanelHeader: boolean
// }
var AVGCreatorPortal = function () {
  var _a = React.useReducer(_avgCreatorReducers.AVGCreatorReducer, _avgCreatorReducers.AVGCreatorInitialState),
      state = _a[0],
      dispatch = _a[1];

  var renderProjectList = function () {
    return React.createElement("div", {
      className: "list-container"
    }, state.projects.length === 0 && React.createElement(_antd.Empty, {
      image: "https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original",
      imageStyle: {
        height: 160
      },
      description: React.createElement("div", {
        className: "empty-list-hint"
      }, "\u5450\uFF0C\u6682\u65F6\u6CA1\u6709\u9879\u76EE\u5462\uFF01")
    }, React.createElement("button", {
      className: "bp3-button bp3-icon-add"
    }, "\u65B0\u5EFA\u9879\u76EE")), state.projects.map(function (p) {
      return React.createElement(_ProjectListItem.ProjectListItem, {
        key: p.key,
        name: p.name,
        description: p.description
      });
    }), React.createElement("div", {
      className: "running-status-info-bar"
    }, React.createElement("p", {
      className: "info"
    }, "\u6B63\u5728\u76D1\u542C http://localhost:2335, \u70B9\u51FB\u6253\u5F00")));
  };

  var onPanelOpen = function () {
    // this.setState({
    //   isShowPanelHeader: true,
    // })
    dispatch(_avgCreatorActions.AVGCreatorActionType.OpenSettingPanel);
  };

  var onPanelClose = function () {
    dispatch(_avgCreatorActions.AVGCreatorActionType.CloseSettingPanel);
  };

  return React.createElement(_core.PanelStack, {
    className: "panel-stack",
    showPanelHeader: state.isShowPanelHeader,
    initialPanel: {
      component: _ProjectListMainPanel.ProjectListMainPanel
    },
    onOpen: onPanelOpen,
    onClose: onPanelClose
  });
};

exports.AVGCreatorPortal = AVGCreatorPortal;
},{"./ProjectListItem":"../src/renderer/easy_creator/components/ProjectListItem.tsx","./AVGCreatorPortal.less":"../src/renderer/easy_creator/components/AVGCreatorPortal.less","./ProjectListMainPanel":"../src/renderer/easy_creator/components/ProjectListMainPanel.tsx","../../redux/reducers/avg-creator-reducers":"../src/renderer/redux/reducers/avg-creator-reducers.ts","../../redux/actions/avg-creator-actions":"../src/renderer/redux/actions/avg-creator-actions.ts"}],"../src/renderer/easy_creator/AVGCreator.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../../../node_modules/@blueprintjs/icons/resources/icons/icons-16.eot":[["icons-16.cb463fa1.eot","../node_modules/@blueprintjs/icons/resources/icons/icons-16.eot"],"../node_modules/@blueprintjs/icons/resources/icons/icons-16.eot"],"./../../../node_modules/@blueprintjs/icons/resources/icons/icons-16.woff":[["icons-16.0347b35c.woff","../node_modules/@blueprintjs/icons/resources/icons/icons-16.woff"],"../node_modules/@blueprintjs/icons/resources/icons/icons-16.woff"],"./../../../node_modules/@blueprintjs/icons/resources/icons/icons-16.ttf":[["icons-16.f39daaaa.ttf","../node_modules/@blueprintjs/icons/resources/icons/icons-16.ttf"],"../node_modules/@blueprintjs/icons/resources/icons/icons-16.ttf"],"./../../../node_modules/@blueprintjs/icons/resources/icons/icons-20.eot":[["icons-20.603e6047.eot","../node_modules/@blueprintjs/icons/resources/icons/icons-20.eot"],"../node_modules/@blueprintjs/icons/resources/icons/icons-20.eot"],"./../../../node_modules/@blueprintjs/icons/resources/icons/icons-20.woff":[["icons-20.8ebf1bff.woff","../node_modules/@blueprintjs/icons/resources/icons/icons-20.woff"],"../node_modules/@blueprintjs/icons/resources/icons/icons-20.woff"],"./../../../node_modules/@blueprintjs/icons/resources/icons/icons-20.ttf":[["icons-20.73310a02.ttf","../node_modules/@blueprintjs/icons/resources/icons/icons-20.ttf"],"../node_modules/@blueprintjs/icons/resources/icons/icons-20.ttf"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/renderer/easy_creator/hooks/context.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppContext = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppContext = _react.default.createContext({});

exports.AppContext = AppContext;
},{}],"../src/renderer/easy_creator/AVGCreator.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _AVGCreatorPortal = require("./components/AVGCreatorPortal");

require("./AVGCreator.less");

var _core = require("@blueprintjs/core");

var _context = require("./hooks/context");

var _avgCreatorReducers = require("../redux/reducers/avg-creator-reducers");

var _avgCreatorActions = require("../redux/actions/avg-creator-actions");

var _icons = require("@blueprintjs/icons");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @format */
// import { ipcMain, ipcRenderer } from "electron-better-ipc"
// import fs from "fs-extra"
// var remote = require("electron").remote
// var electronFs = remote.require("fs")
var AVGCreator = function () {
  var _a = (0, React.useReducer)(_avgCreatorReducers.AVGCreatorReducer, _avgCreatorReducers.AVGCreatorInitialState),
      state = _a[0],
      dispatch = _a[1];

  var _b = (0, React.useState)(false),
      isCreateProjectDialogOpen = _b[0],
      setIsCreateProjectDialogOpen = _b[1];

  var _c = (0, React.useState)("");

  var handleCreateDialogClose = function () {
    setIsCreateProjectDialogOpen(false);
  }; // const handleInputProjectDirectoryChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("on input change ", e)
  // }


  (0, React.useEffect)(function () {
    dispatch(_avgCreatorActions.AVGCreatorActionType.CloseSettingPanel);
  }, [state.isSettingPanelOpen]);
  return React.createElement(_context.AppContext.Provider, {
    value: {
      state: state,
      dispatch: dispatch
    }
  }, React.createElement("div", {
    className: "bp3-dialog-container avg-window-container"
  }, React.createElement("div", {
    className: "bp3-dialog avg-window-dialog"
  }, React.createElement("div", {
    className: "bp3-dialog-header avg-window-header"
  }, React.createElement("h4", {
    className: "bp3-heading avg-window-header-title"
  }, "AVGPlus GUI")), React.createElement("div", {
    className: "bp3-dialog-body avg-window-body"
  }, React.createElement("div", {
    className: "body-content"
  }, React.createElement(_AVGCreatorPortal.AVGCreatorPortal, null))), !state.isSettingPanelOpen && React.createElement("div", {
    className: "bp3-dialog-header avg-creator-footer"
  }, React.createElement("div", {
    className: "bp3-button-group .modifier"
  }, React.createElement(_core.Dialog, {
    className: "create-project-dialog",
    icon: "info-sign",
    onClose: handleCreateDialogClose,
    title: "\u521B\u5EFA\u9879\u76EE",
    isOpen: isCreateProjectDialogOpen,
    usePortal: true,
    hasBackdrop: false,
    transitionDuration: 0,
    canEscapeKeyClose: true
  }, React.createElement("div", {
    className: "container"
  }, React.createElement(_core.FormGroup, {
    inline: false,
    label: "目录名称",
    labelFor: "text-input"
  }, React.createElement(_core.InputGroup, {
    disabled: false,
    leftIcon: _icons.IconNames.CUBE_ADD,
    placeholder: "\u8F93\u5165\u4F60\u7684\u9879\u76EE\u540D\u79F0"
  })))), React.createElement(_core.Button, {
    icon: _icons.IconNames.ADD
  }, "\u65B0\u5EFA\u9879\u76EE"))))));
};

var _default = AVGCreator;
exports.default = _default;
},{"./components/AVGCreatorPortal":"../src/renderer/easy_creator/components/AVGCreatorPortal.tsx","./AVGCreator.less":"../src/renderer/easy_creator/AVGCreator.less","./hooks/context":"../src/renderer/easy_creator/hooks/context.ts","../redux/reducers/avg-creator-reducers":"../src/renderer/redux/reducers/avg-creator-reducers.ts","../redux/actions/avg-creator-actions":"../src/renderer/redux/actions/avg-creator-actions.ts"}],"../src/renderer/App.tsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

require("./App.less");

var _AVGCreator = _interopRequireDefault(require("./easy_creator/AVGCreator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @format */
var App = function () {
  return _react.default.createElement(_AVGCreator.default, null);
};

var _default = App;
exports.default = _default;
},{"./App.less":"../src/renderer/App.less","./easy_creator/AVGCreator":"../src/renderer/easy_creator/AVGCreator.tsx"}],"../src/renderer/index.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/renderer/index.tsx":[function(require,module,exports) {
"use strict";

var React = _interopRequireWildcard(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _App = _interopRequireDefault(require("./App"));

require("./index.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @format */
ReactDOM.render(React.createElement(_App.default, null), document.getElementById('root'));
},{"./App":"../src/renderer/App.tsx","./index.less":"../src/renderer/index.less"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = process.env.HMR_HOSTNAME || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + process.env.HMR_PORT + '/');
  ws.onmessage = function(event) {
    checkedAssets = {};
    assetsToAccept = [];

    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function(asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function(asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();

        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) { // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = (
    '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
      '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
      '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
      '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' +
      '<pre>' + stackTrace.innerHTML + '</pre>' +
    '</div>'
  );

  return overlay;

}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;

  var cached = bundle.cache[id];

  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id)
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}

},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/renderer/index.tsx"], null)
//# sourceMappingURL=/renderer.e66e71b8.js.map