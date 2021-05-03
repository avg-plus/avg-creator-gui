import { GameRunner } from "../../common/services/game-runner";
import { ProjectFileData } from "../../common/manager/project-manager.ts";
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
