import Rx, { Subject } from "rxjs";

export class ObservableModule {
  protected _subject = new Subject();

  subject() {
    return this._subject;
  }
}
