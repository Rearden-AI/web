import { InternalAxiosRequestConfig } from 'axios';

import { StorageNames, getLocalStorageValue } from './local-storage';

export const setAxiosHeader = (
  config: InternalAxiosRequestConfig<unknown>,
): InternalAxiosRequestConfig<unknown> => {
  const token = getLocalStorageValue(StorageNames.ACCESS_TOKEN);

  if (token) config.headers.set('Authorization', `Bearer ${token}`);

  return config;
};
