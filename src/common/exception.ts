export function assert(
  expected: boolean | any,
  message: string,
  cb?: () => void
) {
  if (!expected) {
    cb && cb();
    throw new Error(message);
  }
}

export class Exception {}
