import React, { useRef, useState } from "react";
import { useMount } from "react-use";
import { IComponentProps } from "../component-props";
import { SoundItem } from "./sound-item";
import { MenuSelect } from "../../../controls/menu-select/index.component";
import "./sound-item.component.less";
import { FileInput, Slider, Tag } from "@blueprintjs/core";

interface ISoundComponentProps extends IComponentProps<SoundItem> { }
interface IMenuSelectSoundTrack {
  title: string;
}
interface IMenuSelectSoundAction {
  title: string;
}
const TSoundItemComponent = (props: ISoundComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [track, setTrack] = useState(props.item.track);
  const [action, setAction] = useState(props.item.action);
  const [volume, setVolume] = useState(props.item.volume);
  const [url, setUrl] = useState(props.item.url)
  // 动作
  const actionType = (value: string) => {
    switch (value) {
      case "播放":
        return <FileInput text={url === "" ? "暂未选择" : url} onInputChange={(value) => {
          console.log(value)
        }} />;
      case "音量":
        return <span className="volume">
          <Slider
            className={"slider"}
            min={0}
            max={100}
            stepSize={1}
            onChange={(value: number) => {
              setVolume(value);
            }}
            value={volume}
          /><Tag className={"volume-tag"}
            large={true}
          >{volume}</Tag></span >

    }
    return "";
  }

  useMount(() => {
    props.item.onRefInit(ref);
  });

  return (
    <><div className={"sound-item"} >
      <span className={"title"}>声音</span>
      {" "}
      <span className={"select"}>
        <MenuSelect<IMenuSelectSoundAction>
          displayField={"title"}
          items={[{ title: "播放" }, { title: "暂停" },
          { title: "中止" }, { title: "音量" }]}
          onItemSelect={(value: IMenuSelectSoundAction) => {
            setAction(value.title);
          }}
        ></MenuSelect>
      </span>
      <span className={"select"}>
        <MenuSelect<IMenuSelectSoundTrack>
          displayField={"title"}
          items={[{ title: "BGM" }, { title: "SE" }]}
          onItemSelect={(value: IMenuSelectSoundTrack) => {
            setTrack(value.title);
          }}
        ></MenuSelect>
      </span>
      {actionType(action)}
    </div>
    </>);
};

export const render = (data: SoundItem) => {
  return <TSoundItemComponent item={data}></TSoundItemComponent>;
};

