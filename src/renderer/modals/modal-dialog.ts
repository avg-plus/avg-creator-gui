export interface IModalDialogProps {}

export abstract class ModalDialog<T> {
  abstract show(props: IModalDialogProps): Promise<T>;
}
