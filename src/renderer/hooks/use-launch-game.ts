import { useState, useEffect } from "react";
import { GameRunner } from "../services/game-runner";
import { AVGProjectData } from "../manager/project-manager";
import { DebugServer } from "../../main/debug-server/debug-server";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import PubSub from "pubsub-js";
import { SubcribeEvents } from "../../common/subcribe-events";

export async function useLaunchGame(project: AVGProjectData) {
  await DebugServer.start();
  const result = await GameRunner.runAsDesktop(project);

  return result;
}

export async function useKillGame() {
  GameRunner.desktopProcess.kill();
  await DebugServer.stop();
}
