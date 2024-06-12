export const checkProperty = (obj: unknown, key: string) => {
  return obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, key);
};
