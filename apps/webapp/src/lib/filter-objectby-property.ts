export function filterObjectsByProperty<T>(array1: T[], array2: T[], key: keyof T) {
  return array1.filter(item1 => !array2.some(item2 => item1[key] === item2[key]));
}
