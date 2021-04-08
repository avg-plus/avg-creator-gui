/**
 * v1.0.5 兼容补丁
 *
 * 数据库迁移兼容: 从原本把项目信息存到nedb，改为 db 只存项目路径
 */

import { VersionCompatibility } from "./compatibility-base";
import { DBProjects } from "../../../common/database/db-project";
import {
  AVGProjectData,
  RecentlyProjectRecord,
  AVGProjectManager
} from "../../manager/project-manager.v2.ts";
import { logger } from "../../../common/lib/logger";
import { remote } from "electron";

export class VC_MigratingProjects extends VersionCompatibility {
  expect() {
    return remote.app.getVersion() === "1.0.5-beta.0";
  }

  async run() {
    logger.info("executing VC_MigratingProjects ...");

    const projects = await DBProjects.find({});
    logger.info("VC_MigratingProjects old projects: ", projects);

    const records: RecentlyProjectRecord[] = [];
    projects.map(async (v) => {
      const p = v as AVGProjectData;
      if (p.description || p.engineHash || p.templateHash) {
        records.push({
          dir: p.dir
        });

        // 写入数据文件
        await AVGProjectManager.generateProject(p);
      }
    });

    logger.info("VC_MigratingProjects new records: ", records);

    if (records && records.length) {
      await DBProjects.remove({}, { multi: true });
      await DBProjects.insert(records);
    }
  }
}
