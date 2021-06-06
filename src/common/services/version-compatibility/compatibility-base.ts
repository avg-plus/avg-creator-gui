export interface VersionCompatibility {
  expect(): boolean;
  run(): Promise<void>;
}
