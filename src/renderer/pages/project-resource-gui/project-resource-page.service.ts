import { ProjectResourceWindow } from "../../windows/project-resource-window";
import {
  DBResource,
  DBResourceType
} from "../../common/remote-objects/remote-database";
// menu-item
export type ProjectResourceType = {
  id: string;
  name: string;
  icon: string;
  // type: "classified" | "unclassified";
  type: string;
  index: number;
};
// 资源
export type ResourceItem = {
  id: string;
  path: string;
  name: string;
  type: string;
  description?: string;
  updateDate: Date;
};
// 当前项目属性
export type CurProject = {
  id: string;
  path: string;
  name: string;
};

export class ProjectResourceService {
  static cur: CurProject = {
    id: "",
    path: "",
    name: ""
  };
  // 加载分类菜单
  static async loadProjectMenuList(): Promise<{
    classified: ProjectResourceType[];
    unclassified: ProjectResourceType[];
  }> {
    const classified: ProjectResourceType[] = [];
    const unclassified: ProjectResourceType[] = [];
    let resourceType = await DBResourceType.find({}).sort({ index: 1 });
    // 如果没有分类则 添加默认分类
    if (resourceType.length === 0) {
      const insert = await DBResourceType.insert([
        { name: "立绘", icon: "people", type: "classified", index: 0 },
        { name: "场景", icon: "map-marker", type: "classified", index: 1 },
        { name: "音频", icon: "music", type: "classified", index: 2 },
        { name: "UI", icon: "underline", type: "classified", index: 3 },
        {
          name: "图片",
          icon: "image-rotate-right",
          type: "classified",
          index: 4
        },
        { name: "未分类", icon: "grid", type: "unclassified", index: 1 },
        {
          name: "临时分类",
          icon: "add-to-folder",
          type: "unclassified",
          index: 0
        }
      ]);
      resourceType = await DBResourceType.find({});
    }

    resourceType.forEach((v) => {
      if (v["type"] === "classified") {
        classified.push({
          id: v._id,
          name: v["name"],
          icon: v["icon"],
          type: "classified",
          index: v["index"]
        });
      } else {
        unclassified.push({
          id: v._id,
          name: v["name"],
          icon: v["icon"],
          type: "unclassified",
          index: v["index"]
        });
      }
    });

    return {
      classified: classified,
      unclassified: unclassified
    };
  }

  // 加载项目所有资源
  static async loadAllResourceList(): Promise<ResourceItem[]> {
    const result: ResourceItem[] = [];
    return result;
  }

  static async openProjectResourceWorkspace(
    id: string,
    path: string,
    name: string
  ) {
    this.cur.id = id;
    this.cur.name = name;
    this.cur.path = path;
    await ProjectResourceWindow.open({ project_dir: path }, `${id}`);
    await ProjectResourceWindow.setTitle(`${name} - 资源管理`);
  }

  static async insertResourceType(
    name: string,
    isClassified: string,
    index: number
  ) {
    const insert = await DBResourceType.insert({
      name: name,
      icon: "folder-open",
      type: isClassified,
      index: index
    });
    return insert;
  }

  static async deleteResourceType(id: string) {
    const remove = await DBResourceType.remove({ _id: id }, {});
    return remove;
  }

  static async updateResourceType(item: ProjectResourceType) {
    const update = await DBResourceType.update({ _id: item.id }, {
      $set: {
        name: item.name,
        index: item.index
      }
    });
    console.log(update);
    return update;
  }
}
