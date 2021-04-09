import {
  IDialogeSaveData,
  ISaveData,
  IWaitSaveData,
  StoryItemType
} from "../../story-item-type";

export class Codegen {
  static generators = new Map<StoryItemType, (data: any) => string>();

  static init() {
    this.generators.set(StoryItemType.ShowDialogue, this.genTextShow);
    this.generators.set(StoryItemType.Wait, this.genWait);
  }

  static generate(saveData: ISaveData) {
    const type = saveData.type;
    const genrator = this.generators.get(type);
    if (genrator) {
      return genrator(saveData.data);
    }

    return "";
  }

  private static genTextShow<T extends IDialogeSaveData>(data: T) {
    return `text.show("${data.text}");`;
  }

  private static genWait<T extends IWaitSaveData>(data: T) {
    return `flow.wait(${data.time});`;
  }
}
