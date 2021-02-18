import React, { useRef, useState } from "react";
import { useMount } from "react-use";
import { IComponentProps } from "../component-props";
import { SoundItem } from "./sound-item";
import { MenuSelect } from "../../../controls/menu-select/index.component";
import log from "electron-log"
import "./sound-item.component.less";
import { FileInput, Slider } from "@blueprintjs/core";

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
  useMount(() => {
    props.item.onRefInit(ref);
  });

  return (
    <><div className={"sound-item"} >
      <span className={"title"}>音频</span>
      {" "}
      <MenuSelect<IMenuSelectSoundAction>
        displayField={"title"}
        items={[{ title: "播放" }, { title: "暂停" },
        { title: "中止" }, { title: "音量" }]}
        onItemSelect={(value: IMenuSelectSoundAction) => {
          log.log(action)
          setAction(value.title);
          log.log(action)
        }}
      ></MenuSelect>
      <MenuSelect<IMenuSelectSoundTrack>
        displayField={"title"}
        items={[{ title: "BGM" }, { title: "SE" }]}
        onItemSelect={(value: IMenuSelectSoundTrack) => {
          setTrack(value.title);
        }}
      ></MenuSelect>
      <FileInput text="Choose file..." />
      <Slider initialValue={volume} />

    </div>
    </>);
};

export const render = (data: SoundItem) => {
  return <TSoundItemComponent item={data}></TSoundItemComponent>;
};

// export const renderExtendContextMenu = () => {
//   return [];
// };
