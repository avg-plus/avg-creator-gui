import { APIDialogueData } from "../../../../common/models/dialogue";
import { CodegenContext } from "../codegen";

export default (context: CodegenContext, data: APIDialogueData) => {
  if (!data.text.length) {
    return "";
  }

  let name = "";
  if (context.currentCharacter) {
    name = context.currentCharacter.name;
  }

  return `text.show("${data.text}", { name: "${name}" })`;
};
