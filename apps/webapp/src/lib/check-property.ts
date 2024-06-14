export function checkProperty<T>(obj: unknown, key: string): obj is T {
  return obj instanceof Object && Object.prototype.hasOwnProperty.call(obj, key);
}
