import { AVGProjectManager } from "../../../common/services/project-manager";
import { RendererApplication } from "../../../common/services/renderer-application";
import { WorkspaceWindow } from "../../windows/workspace-window";

export type LayoutPanelID =
  | "StoryTree"
  | "StoryBoard"
  | "Preview"
  | "PropertyView";

export class GUIWorkspaceService {
  static layout: Record<LayoutPanelID, { title: string }> = {
    StoryTree: { title: "故事管理" },
    StoryBoard: { title: "剧本编辑器" },
    Preview: { title: "预览" },
    PropertyView: { title: "属性" }
  };

  static async setProject(projectDir: string) {
    const data = AVGProjectManager.readProjectData(projectDir);
    RendererApplication.updateTitle(`${data.project_name} — AVG Creator`);
  }
}
