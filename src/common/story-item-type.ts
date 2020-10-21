export enum StoryItemType {
  None,
  Dialogue,
  Wait
}

export interface ISaveDataContent {}

export interface ISaveData {
  type: StoryItemType;
  data: ISaveDataContent;
}

export interface IDialogeSaveData extends ISaveDataContent {
  text: string;
}
