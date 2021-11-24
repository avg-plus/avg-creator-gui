import { useContext } from "react";
import { GameRunner } from "../../common/services/game-runner";
import { GUIToaster } from "../common/toaster";
import { Intent } from "@blueprintjs/core";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import { ProjectFileData } from "../../common/services/file-reader/project-file-reader";

export async function useServe(
  project: ProjectFileData,
  dispatch: (o: any) => void
) {
  try {
    const serverStatus = await GameRunner.serve(project);

    if (serverStatus) {
      GUIToaster.show({
        message: "开启服务成功",
        intent: Intent.SUCCESS
      });
    }

    dispatch({
      type: AVGCreatorActionType.StartServer,
      payload: {
        serverProject: project,
        isRunning: true
      }
    });
  } catch (error) {
    GUIToaster.show({
      message: "启动服务错误：" + error.toString(),
      intent: Intent.DANGER
    });
  }
}

export async function useStopServe(dispatch: (o: any) => void) {
  await GameRunner.close();

  dispatch({
    type: AVGCreatorActionType.StartServer,
    payload: {
      serverProject: null,
      isRunning: false
    }
  });

  GUIToaster.show({
    message: "停止服务",
    intent: Intent.WARNING
  });
}
