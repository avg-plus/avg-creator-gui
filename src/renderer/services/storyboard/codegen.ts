import {
  IDialogeSaveData,
  ISaveData,
  ISaveDataContent,
  StoryItemType
} from "../../../common/story-item-type";

export class Codegen {
  static generators = new Map<StoryItemType, (data: any) => string>();

  static init() {
    this.generators.set(StoryItemType.Dialogue, this.genDialogue);
  }

  static generate(saveData: ISaveData) {
    const type = saveData.type;
    const genrator = this.generators.get(type);
    if (genrator) {
      return genrator(saveData.data);
    }

    return "";
  }

  private static genDialogue<T extends IDialogeSaveData>(data: T) {
    return `text.show("${data.text}");`;
  }
}
