import { VC_MigratingProjects } from "./migrating-projects";

const compatibilities = [
  // v1.0.5-beta.0 项目文件迁移
  new VC_MigratingProjects()
];

compatibilities.map(async (v) => {
  if (v.expect()) {
    await v.run();
  }
});
