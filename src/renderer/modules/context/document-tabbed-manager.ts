interface DocumentTab {
  title: string;
  closable: boolean;
}

export class DocumentTabbedManager {
  private tabs: DocumentTab[] = [];
  getTabs() {}
}
