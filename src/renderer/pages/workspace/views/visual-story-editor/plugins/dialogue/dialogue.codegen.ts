import { APIDialogueData } from "../../../../../../../common/models/dialogue";
import { CodegenContext } from "../../../../../../modules/compilers/codegen-context";

export default (context: CodegenContext, data: APIDialogueData) => {
  let name = "";
  if (context.currentCharacter) {
    name = context.currentCharacter.name;
  }

  return `text.show("${data.text}", { name: "${name}" })`;
};
