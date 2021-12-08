import { RendererApplication } from "../../../common/services/renderer-application";
import { AVGProjectManager } from "../../modules/context/project-manager";
import { WorkspaceContext } from "../../modules/context/workspace-context";

export type LayoutPanelID =
  | "StoryTree"
  | "StoryBoard"
  | "Preview"
  | "DebugView"
  | "PropertyView";

export class GUIWorkspaceService {
  static layout: Record<LayoutPanelID, { title: string }> = {
    StoryTree: { title: "故事管理" },
    StoryBoard: { title: "剧本编辑器" },
    Preview: { title: "预览" },
    PropertyView: { title: "属性" },
    DebugView: { title: "调试" }
  };

  public static async loadProject(projectDir: string) {
    const data = AVGProjectManager.readProjectData(projectDir);
    RendererApplication.updateTitle(`${data.project_name} — AVG Creator`);

    WorkspaceContext.loadProject(projectDir);
  }
}
