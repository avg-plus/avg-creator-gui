import Analytics from "electron-google-analytics";

export class GoogleAnalytics {
  private static analytics: Analytics;

  static init() {
    // this.analytics = new Analytics("UA-93668618-1");
    // const analytics = new Analytics("UA-93668618-1");
    const analytics = new Analytics.default("UA-93668618-1");

    console.log(Analytics);
  }

  static event(category: string, action: string, data: any) {
    this.analytics.event(category, action, data);
  }
}
