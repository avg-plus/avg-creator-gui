/** @format */

import "../common/lib/logger";

import { GUIWindowApplication } from "../common/services/app-init";

import "./index.less";
import { ProjectBrowserWindow } from "./windows/project-browser-window";

// ========================================
// 初始化应用
// ========================================

ProjectBrowserWindow.open({});
