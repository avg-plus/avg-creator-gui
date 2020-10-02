export function assert(
  expected: boolean | any,
  message: string,
  cb?: () => void
) {
  if (!expected) {
    cb && cb();
    const error = new Error(message);
    throw error;
  }
}

export class Exception {}
