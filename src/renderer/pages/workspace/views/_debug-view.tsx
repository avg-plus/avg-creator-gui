import { Button } from "@blueprintjs/core";
import React from "react";
import { Codegen } from "../../../services/storyboard/codegen";
import { StoryManager } from "../../../services/storyboard/story-manager";

export const _DevelopmentDebugView = () => {
  const onGenerateCode = () => {
    const code = StoryManager.currentStory.getAllItems().map((v) => {
      return Codegen.generate(v.onSave());
    });

    console.log(code.join("\n"));
  };

  return (
    <>
      <div>
        <Button onClick={onGenerateCode}>生成代码</Button>
      </div>
    </>
  );
};
