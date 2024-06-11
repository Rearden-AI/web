export const checkProperty = (obj: unknown, key: string) => {
  return obj instanceof Object && obj.hasOwnProperty(key);
};
