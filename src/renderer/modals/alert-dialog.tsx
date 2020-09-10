import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";

import { Alert, Intent, IconName } from "@blueprintjs/core";
import { ModalDialog, IModalDialogProps } from "./modal-dialog";
import { SubcribeEvents } from "../../common/subcribe-events";
import { useHotkeys } from "react-hotkeys-hook";

interface IAlertDialogResult {
  isCancel: boolean;
  isConfirm: boolean;
}

export interface IAlertDialogProps extends IModalDialogProps {
  text: React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
  intent?: Intent;
  icon?: IconName;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const RenderAlertDialog = (props: IAlertDialogProps) => {
  const [isShow, setIsShow] = useState(true);
  useEffect(() => {
    const token = PubSub.subscribe(
      SubcribeEvents.GUIAlertDialogVisibility,
      (event: SubcribeEvents, data: any) => {
        setIsShow(data.show);
      }
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  // useHotkeys(
  //   "enter",
  //   () => {
  //     props.onConfirm && props.onConfirm();
  //     setIsShow(false);
  //   },
  //   { filter: () => true },
  //   [isShow]
  // );

  return (
    <Alert
      cancelButtonText={props.cancelButtonText}
      confirmButtonText={props.confirmButtonText}
      icon={props.icon}
      isOpen={isShow}
      canOutsideClickCancel={false}
      intent={props.intent ?? Intent.PRIMARY}
      onCancel={props.onCancel}
      onConfirm={props.onConfirm}
      canEscapeKeyCancel={true}
      onClose={props.onClose}
      style={{
        width: "86%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0,0) !important"
      }}
    >
      {props.text}
    </Alert>
  );
};

class AlertDialog extends ModalDialog<IAlertDialogResult> {
  show(props: IAlertDialogProps): Promise<IAlertDialogResult> {
    return new Promise((resolve) => {
      const data: IAlertDialogResult = {
        isCancel: true,
        isConfirm: false
      };

      const container = document.createElement("div");
      // Alert.defaultProps.portalContainer = container;

      ReactDOM.render(
        <RenderAlertDialog
          {...props}
          confirmButtonText={props.confirmButtonText ?? "确定"}
          cancelButtonText={props.cancelButtonText ?? "取消"}
          onConfirm={() => {
            data.isConfirm = true;
            data.isCancel = false;
            props.onConfirm && props.onConfirm();
          }}
          onCancel={() => {
            data.isConfirm = false;
            data.isCancel = true;
            props.onCancel && props.onCancel();
          }}
          onClose={() => {
            props.onClose && props.onClose();
            PubSub.publishSync(SubcribeEvents.GUIAlertDialogVisibility, {
              show: false
            });

            resolve(data);
          }}
        />,
        container
      );
    });
  }
}

export const GUIAlertDialog = new AlertDialog();
