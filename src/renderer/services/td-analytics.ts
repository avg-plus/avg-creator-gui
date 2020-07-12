export class TDAPP {
  static async onEvent(eventId: string, label: string, data: any) {
    window["TDAPP"].onEvent(eventId, label, data);
  }
}
