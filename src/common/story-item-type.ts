export enum StoryItemType {
  None,
  ShowDialogue,
  Character,
  Scene,
  Wait,
  Sound
}

export interface ISaveDataContent {}

export interface ISaveData {
  type: StoryItemType;
  data: ISaveDataContent;
}

export interface IDialogeSaveData extends ISaveDataContent {
  text: string;
}

export interface IWaitSaveData extends ISaveDataContent {
  time: number;
}
