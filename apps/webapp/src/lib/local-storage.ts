export enum StorageNames {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  SUI_TOKEN = 'SUI_JWT',
  JWT_DATA = 'JWT_DATA',
}

export const getLocalStorageValue = (key: StorageNames) => localStorage.getItem(key) ?? null;

export const setLocalStorageValue = (key: StorageNames, value: string) =>
  localStorage.setItem(key, value);

export const removeLocalStorageValue = (key: StorageNames) => localStorage.removeItem(key);
