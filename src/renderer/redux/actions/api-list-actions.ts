import { APIEntity } from "../../models/entities/api-entity";

export enum APIListActionType {
  SELECT_ITEM, // 选中一个动作
  UPDATE_ITEM // 更新动作属性
}

export class APIListActions {
  static selectItem(entity: APIEntity) {
    return {
      type: APIListActionType.SELECT_ITEM,
      entity
    };
  }

  static updateItem(entity: APIEntity) {
    return {
      type: APIListActionType.UPDATE_ITEM,
      entity
    };
  }
}
