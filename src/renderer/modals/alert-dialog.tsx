import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";

import { Alert, Intent, IconName, Checkbox } from "@blueprintjs/core";
import { ModalDialog, IModalDialogProps } from "./modal-dialog";
import { GlobalEvents } from "../../common/global-events";
import { ObservableContext } from "../../common/services/observable-module";
import { useMount, useUnmount } from "react-use";

interface IAlertDialogResult {
  isCancel: boolean;
  isConfirm: boolean;
  isChecked: boolean;
}

interface IAlertDialogData {
  checked: boolean;
}

export interface IAlertDialogProps extends IModalDialogProps {
  text: React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
  intent?: Intent;
  icon?: IconName;
  checkbox?: {
    label: string;
    defaultChecked?: boolean;
  };
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: (data?: IAlertDialogData) => void;
}

const RenderAlertDialog = (props: IAlertDialogProps) => {
  const [isShow, setIsShow] = useState(true);
  const [isChecked, setIsChecked] = useState(
    props.checkbox?.defaultChecked ?? false
  );

  useMount(() => {
    ObservableContext.subscribe(
      GlobalEvents.GUIAlertDialogVisibility,
      (visibility: boolean) => {
        setIsShow(visibility);
      }
    );
  });

  return (
    <Alert
      cancelButtonText={props.cancelButtonText}
      confirmButtonText={props.confirmButtonText}
      icon={props.icon}
      isOpen={isShow}
      canOutsideClickCancel={false}
      intent={props.intent ?? Intent.PRIMARY}
      onCancel={props.onCancel}
      onConfirm={() => {
        props.onConfirm &&
          props.onConfirm({
            checked: isChecked
          });
      }}
      canEscapeKeyCancel={true}
      onClose={props.onClose}
      style={{
        width: "86%",
        height: "auto",
        backgroundColor: "rgba(0,0,0,0,0) !important"
      }}
    >
      {props.text}
      {props.checkbox && props.checkbox.label && (
        <div>
          <br />
          <Checkbox
            defaultChecked={isChecked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIsChecked(e.target.checked);
            }}
          >
            {props.checkbox.label}
          </Checkbox>
        </div>
      )}
    </Alert>
  );
};

class AlertDialog extends ModalDialog<IAlertDialogResult> {
  show(props: IAlertDialogProps): Promise<IAlertDialogResult> {
    return new Promise((resolve) => {
      const result: IAlertDialogResult = {
        isCancel: true,
        isConfirm: false,
        isChecked: false
      };

      const container = document.createElement("div");
      // Alert.defaultProps.portalContainer = container;

      ReactDOM.render(
        <RenderAlertDialog
          {...props}
          confirmButtonText={props.confirmButtonText ?? "确定"}
          cancelButtonText={props.cancelButtonText ?? ""}
          onConfirm={(data: IAlertDialogData) => {
            result.isConfirm = true;
            result.isCancel = false;
            result.isChecked = data.checked;

            props.onConfirm && props.onConfirm(data);
          }}
          onCancel={() => {
            result.isConfirm = false;
            result.isCancel = true;
            props.onCancel && props.onCancel();
          }}
          onClose={() => {
            props.onClose && props.onClose();

            ObservableContext.next(
              GlobalEvents.GUIAlertDialogVisibility,
              false
            );

            resolve(result);
          }}
        />,
        container
      );
    });
  }
}

export const GUIAlertDialog = new AlertDialog();
