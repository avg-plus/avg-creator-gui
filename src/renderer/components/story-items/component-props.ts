import { StoryItem } from "./story-item";

export interface IComponentProps<T extends StoryItem> {
  item: T;
}
