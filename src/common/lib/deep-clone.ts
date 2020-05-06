import { isDate } from "util";

export const deepClone = (obj: any) => {
  // obj存在才转化成对象，null和undefined保持原样
  if (!obj) {
    return obj;
  }

  let clone: any = null;
  // Date对象没有key, Object.assign不生效。所以生成一个新的Date方式
  if (isDate(obj)) {
    clone = new Date(obj.valueOf());
  } else {
    clone = Object.assign({}, obj);
  }

  Object.keys(clone).forEach(
    (key) =>
      (clone[key] =
        typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key])
  );

  // fix bug: 如果obj是空数组的话会返回0
  // return Array.isArray(obj)
  //   ? (clone.length = obj.length) && Array.from(clone)
  //   : clone

  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }

  return clone;
};
