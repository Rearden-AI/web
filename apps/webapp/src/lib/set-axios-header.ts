import { InternalAxiosRequestConfig } from 'axios';

import { getToken } from './token';

export const setAxiosHeader = (
  config: InternalAxiosRequestConfig<unknown>,
): InternalAxiosRequestConfig<unknown> => {
  const token = getToken();

  if (token) config.headers.set('Authorization', `Bearer ${token}`);

  return config;
};
