import { ProjectFileData } from "../../common/services/file-reader/project-file-stream";
import { GameRunner } from "../../common/services/game-runner";
import { DebugServer } from "../../main/debug-server/debug-server";

export async function useLaunchGame(project: ProjectFileData) {
  await DebugServer.start();
  const result = await GameRunner.runAsDesktop(project);

  return result;
}

export async function useKillGame() {
  GameRunner.desktopProcess.kill();
  await DebugServer.stop();
}
