export enum IPCMainEvents {
  ShowOpenDialog = "ShowOpenDialog",
  GetPath = "GetPath"
}

export enum IPCRendererEvents {
  CheckingForUpdates = "CheckingForUpdates",
  UpdateAvailable = "UpdateAvailable",
  UpdateNotAvailable = "UpdateNotAvailable",
  UpdateDownloaded = "UpdateDownloaded"
}
