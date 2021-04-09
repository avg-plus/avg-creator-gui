import { GameRunner } from "../../common/services/game-runner";
import { AVGProjectData } from "../../common/manager/project-manager.v2.ts";
import { DebugServer } from "../../main/debug-server/debug-server";

export async function useLaunchGame(project: AVGProjectData) {
  await DebugServer.start();
  const result = await GameRunner.runAsDesktop(project);

  return result;
}

export async function useKillGame() {
  GameRunner.desktopProcess.kill();
  await DebugServer.stop();
}
