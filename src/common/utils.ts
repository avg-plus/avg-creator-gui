export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomBetween(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

export function randomIn<T>(arr: T[]) {
  const min = Math.ceil(0);
  const max = Math.floor(arr.length - 1);
  return arr[Math.floor(Math.random() * (max - min + 1)) + min];
}

export function delayExecution(func: () => void, timeout: number) {
  setTimeout(() => {
    func();
  }, timeout);
}
