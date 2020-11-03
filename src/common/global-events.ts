export enum GlobalEvents {
  // 调试组件更新
  DebugComponentsShouldRender = "DebugComponentsShouldRender",

  // 故事列表变更时触发
  StoryItemListShouldRender = "StoryItemListShouldRender",

  // 内容变更时触发
  StoryItemContentChanged = "StoryItemContentChanged",

  // 删除时触发
  StoryItemShouldDelete = "StoryItemShouldDelete",

  // 在对话 API 回车键时触发
  DialogueShouldCreate = "DialogueShouldCreate",

  // 上下移动时触发
  StoryItemNavigateTo = "StoryItemNavigateTo",

  // 触发故事节点列表计算高度
  RecomputeStoryNodeHeights = "RecomputeStoryNodeHeights"
}
