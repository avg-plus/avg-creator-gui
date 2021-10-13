import { APICharacterData } from "../../../../../../../common/models/character";
import { CodegenContext } from "../../../../../../modules/compilers/codegen-context";

export default (context: CodegenContext, data: APICharacterData) => {
  return `character.show("${data.character_id}"", "${data.avatarPath}");`;
};
