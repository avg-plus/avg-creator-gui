/** @format */

import * as React from "react";
import { ProjectListItem } from "./ProjectListItem";

import "./AVGCreatorPortal.less";
import { PanelStack } from "@blueprintjs/core";
import { ProjectListMainPanel } from "./ProjectListMainPanel";
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions";
import { useContext } from "react";
import { CreatorContext } from "../hooks/context";

export const AVGCreatorPortal = () => {
  const { state, dispatch } = useContext(CreatorContext);

  const onPanelOpen = () => {
    dispatch({ type: AVGCreatorActionType.OpenSettingPanel });
  };

  const onPanelClose = () => {
    dispatch({ type: AVGCreatorActionType.CloseSettingPanel });
  };

  return (
    <PanelStack
      className="panel-stack"
      showPanelHeader={true}
      initialPanel={{ component: ProjectListMainPanel }}
      onOpen={onPanelOpen}
      onClose={onPanelClose}
    />
  );
};
