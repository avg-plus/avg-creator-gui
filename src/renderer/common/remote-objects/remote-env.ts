import { remote } from "electron";
import { _Env } from "../../../main/remote/env";
const managerModule = __dirname + "/../src/main/remote/env";

export const Env: _Env = remote.require(managerModule).default;

console.log("Env", Env);
