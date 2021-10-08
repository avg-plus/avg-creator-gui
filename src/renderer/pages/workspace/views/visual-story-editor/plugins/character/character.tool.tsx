import React, { useState } from "react";
import ReactDOM from "react-dom";
import className from "classnames";

import { CETool } from "../ce-plugin";

import "./character.tool.less";
import {
  APICharacterBlockService,
  APICharacterData
} from "./character.service";
import { BlockToolConstructorOptions } from "@editorjs/editorjs";
import { useMount } from "react-use";
import { PluginBaseWrapperComponent } from "../plugin-base-wrapper";
import { EditorBlockDocument } from "../../editor-block-manager";

interface CharacterViewProps {
  context: APICharacterTool;
}

const CharacterView = (props: CharacterViewProps) => {
  const [avatarThumbnail, setAvatarThumbnail] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [isSelected, setIsSelected] = useState(
    props.context.service.isSelected()
  );

  useMount(() => {
    props.context.service.bindingRendererStates({
      avatarThumbnail: { value: avatarThumbnail, setValue: setAvatarThumbnail },
      characterName: { value: characterName, setValue: setCharacterName },
      isSelected: { value: isSelected, setValue: setIsSelected }
    });

    props.context.service.onBlockInit();
  });

  return (
    <div className={"character-tool-container"}>
      <div
        className={className("card", {
          selected: isSelected
        })}
      >
        <img className={"avatar-thumbnail"} src={avatarThumbnail}></img>
        <span className="title">{characterName}</span>
      </div>
    </div>
  );
};

export class APICharacterTool extends CETool<
  APICharacterData,
  APICharacterBlockService
> {
  constructor(options: BlockToolConstructorOptions<APICharacterData>) {
    super(options, new APICharacterBlockService(options));
    this.service.registerToolView(this);
  }

  static get toolbox() {
    return {
      title: "立绘",
      icon: '<svg t="1633577722225" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4705" width="200" height="200"><path d="M681.386667 619.946667L576 725.333333l-64-64 85.333333-85.333333a42.794667 42.794667 0 0 0 42.666667 42.666667h21.333333a155.733333 155.733333 0 0 1 20.053334 1.28zM384 618.666667a42.794667 42.794667 0 0 0 42.666667-42.666667l85.333333 85.333333-64 64-105.386667-105.386666A155.733333 155.733333 0 0 1 362.666667 618.666667z" fill="#F8FAFD" p-id="4706"></path><path d="M704 1002.666667H192V789.333333a170.410667 170.410667 0 0 1 150.613333-169.386666L448 725.333333l64-64 64 64 105.386667-105.386666A170.410667 170.410667 0 0 1 832 789.333333v213.333334z" fill="#64A6F0" p-id="4707"></path><path d="M426.666667 576v-64l0.64-1.28A167.530667 167.530667 0 0 0 512 533.333333a169.685333 169.685333 0 0 0 84.693333-22.613333L597.333333 512v64l-85.333333 85.333333zM725.333333 304.426667A42.666667 42.666667 0 0 1 704 384h-21.333333l-1.28-0.213333A172.8 172.8 0 0 0 682.666667 362.666667v-64h21.333333a42.666667 42.666667 0 0 1 21.333333 5.76zM341.333333 362.666667a172.8 172.8 0 0 0 1.28 21.12L341.333333 384h-21.333333a42.666667 42.666667 0 0 1 0-85.333333h21.333333z" fill="#FFD0AA" p-id="4708"></path><path d="M682.666667 298.666667v64a170.325333 170.325333 0 0 1-49.92 120.746666 167.210667 167.210667 0 0 1-36.053334 27.306667A169.685333 169.685333 0 0 1 512 533.333333a167.530667 167.530667 0 0 1-84.693333-22.613333 170.538667 170.538667 0 0 1-84.693334-126.933333A172.8 172.8 0 0 1 341.333333 362.666667v-64c94.293333 0 170.666667-55.04 170.666667-149.333334 0 94.293333 76.373333 149.333333 170.666667 149.333334z" fill="#FFD0AA" p-id="4709"></path><path d="M725.333333 234.666667v69.76a42.666667 42.666667 0 0 0-21.333333-5.76h-21.333333c-94.293333 0-170.666667-55.04-170.666667-149.333334 0 94.293333-76.373333 149.333333-170.666667 149.333334h-21.333333a42.666667 42.666667 0 0 0-21.333333 5.76V234.666667a213.333333 213.333333 0 0 1 426.666666 0z" fill="#7C8691" p-id="4710"></path><path d="M832 1024H192a21.333333 21.333333 0 0 1-21.333333-21.333333V789.333333a192.213333 192.213333 0 0 1 192-192h21.333333a21.333333 21.333333 0 0 0 21.333333-21.333333v-64h42.666667v64a64 64 0 0 1-64 64h-21.333333a149.504 149.504 0 0 0-149.333334 149.333333v192h597.333334v-192a149.504 149.504 0 0 0-149.333334-149.333333h-21.333333a64 64 0 0 1-64-64v-64h42.666667v64a21.333333 21.333333 0 0 0 21.333333 21.333333h21.333333a192.213333 192.213333 0 0 1 192 192v213.333334a21.333333 21.333333 0 0 1-21.333333 21.333333z" fill="#2A3244" p-id="4711"></path><path d="M512 554.666667a192.213333 192.213333 0 0 1-192-192v-64h42.666667v64a149.333333 149.333333 0 0 0 298.666666 0v-64h42.666667v64a192.213333 192.213333 0 0 1-192 192z" fill="#2A3244" p-id="4712"></path><path d="M704 405.333333h-21.333333v-42.666666h21.333333a21.333333 21.333333 0 0 0 0-42.666667h-21.333333v-42.666667h21.333333a64 64 0 0 1 0 128zM341.333333 405.333333h-21.333333a64 64 0 0 1 0-128h21.333333v42.666667h-21.333333a21.333333 21.333333 0 0 0 0 42.666667h21.333333z" fill="#2A3244" p-id="4713"></path><path d="M746.666667 320h-42.666667v-85.333333a192 192 0 0 0-384 0v85.333333h-42.666667v-85.333333a234.666667 234.666667 0 0 1 469.333334 0zM512 682.666667a21.333333 21.333333 0 0 1-15.082667-6.250667l-85.333333-85.333333 30.165333-30.165334L512 631.168l70.250667-70.250667 30.165333 30.165334-85.333333 85.333333A21.333333 21.333333 0 0 1 512 682.666667z" fill="#2A3244" p-id="4714"></path><path d="M682.666667 320c-78.08 0-139.904-33.472-170.666667-87.296C481.237333 286.528 419.413333 320 341.333333 320v-42.666667c74.325333 0 149.333333-39.573333 149.333334-128a21.333333 21.333333 0 0 1 42.666666 0c0 88.426667 75.008 128 149.333334 128zM576 746.666667a21.333333 21.333333 0 0 1-15.082667-6.250667L512 691.498667l-48.917333 48.917333a21.333333 21.333333 0 0 1-30.165334 0l-106.666666-106.666667 30.165333-30.165333L448 695.168l48.917333-48.917333a21.333333 21.333333 0 0 1 30.165334 0L576 695.168l91.584-91.584 30.165333 30.165333-106.666666 106.666667A21.333333 21.333333 0 0 1 576 746.666667zM682.666667 853.333333h42.666666v149.333334h-42.666666zM298.666667 853.333333h42.666666v149.333334h-42.666666z" fill="#2A3244" p-id="4715"></path></svg>'
    };
  }

  render() {
    const root = document.createElement("div");
    ReactDOM.render(
      <PluginBaseWrapperComponent blockID={this.service.getBlockID()}>
        <CharacterView context={this}></CharacterView>
      </PluginBaseWrapperComponent>,
      root,
      () => {}
    ) as unknown as HTMLElement;

    root.onkeydown = this.onKeyDown.bind(this);

    return root;
  }

  onKeyDown(e: KeyboardEvent): void {}

  onKeyUp(e: KeyboardEvent) {}

  save() {
    return this.service.getData();
  }
}
