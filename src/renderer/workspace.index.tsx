import * as React from "react";
import * as ReactDOM from "react-dom";

import "./workspace.index.less";

import { AVGWorkspace } from "./pages/workspace/avg-workspace";
import { Color, Titlebar } from "custom-electron-titlebar";

new Titlebar({
  titleHorizontalAlignment: "center",
  maximizable: true,
  minimizable: true,
  closeable: true,
  backgroundColor: Color.fromHex("#000000")
});

ReactDOM.render(
  <AVGWorkspace />,
  document.getElementById("root") as HTMLElement
);
