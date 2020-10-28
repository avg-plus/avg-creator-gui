import { ResourceTreeNodeTypes } from "./resource-tree-node-types";

export const DefaultTreeNodes = [
  //   {
  //     title: "资源库",
  //     nodeType: ResourceTreeNodeTypes.ResourceRootFolder,
  //     children: [
  //       {
  //         title: "立绘",
  //         nodeType: ResourceTreeNodeTypes.ResourceRootFolder
  //       },
  //       {
  //         title: "场景",
  //         nodeType: ResourceTreeNodeTypes.ResourceRootFolder
  //       },
  //       {
  //         title: "其它图形",
  //         nodeType: ResourceTreeNodeTypes.ResourceRootFolder
  //       },
  //       {
  //         title: "多媒体",
  //         nodeType: ResourceTreeNodeTypes.ResourceRootFolder
  //       }
  //     ]
  //   },
  //   {
  //     title: "预设数据",
  //     nodeType: ResourceTreeNodeTypes.ScriptRootFolder,
  //     children: [
  //       {
  //         title: "角色",
  //         nodeType: ResourceTreeNodeTypes.ResourceRootFolder
  //       },
  //       {
  //         title: "场景",
  //         nodeType: ResourceTreeNodeTypes.ResourceRootFolder
  //       }
  //     ]
  //   },
  //   {
  //     title: "脚本",
  //     nodeType: ResourceTreeNodeTypes.ScriptRootFolder,
  //     children: []
  //   },
  {
    title: "剧本",
    nodeType: ResourceTreeNodeTypes.StoryRootFolder,
    children: [
      {
        title: "开场",
        nodeType: ResourceTreeNodeTypes.StoryNode
      }
    ]
  }
];

// for (let i = 0; i < 10000; ++i) {
//   DefaultTreeNodes.push(DefaultTreeNodes[0]);
// }
