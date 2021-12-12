/**
 * 处理快捷键
 * 
⌘ Command (or Cmd)
⇧ Shift
⌥ Option (or Alt)
⌃ Control (or Ctrl)
 */

import { Env } from "./remote-objects/remote-env";

const HotKeys = {
  Copy: ["⌘C", "Ctrl + C"],
  Cut: ["⌘X", "Ctrl + X"],
  Paste: ["⌘V", "Ctrl + V"]
};

class HotKeysManager {
  hotkeyToLabel(keys: keyof typeof HotKeys) {
    const key = HotKeys[keys];

    if (Env.getOSName() === "MacOS") {
      return key[0];
    }

    return key[1];
  }
}

export default new HotKeysManager();
