import { APIListActionType } from "./../actions/api-list-actions";
import { APIEntity } from "../../models/entities/api-entity";

const APIListReducer = (state, action): { type: APIListActionType; entity: APIEntity } => {
  let data: any = { type: action.type };

  switch (action.type) {
    case APIListActionType.SELECT_ITEM:
    case APIListActionType.UPDATE_ITEM:
      return { ...data, entity: action.entity };
    default:
      return { ...action };
  }
};

export default APIListReducer;
