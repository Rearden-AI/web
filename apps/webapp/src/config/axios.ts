import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { ApiRoutes } from '../constants/api-routes';
import { disconnect } from '@wagmi/core';
import { wagmiConfig } from './wagmi';
import { REARDEN_SESSION_ID } from '../constants/constants';

export const BASE_URL = process.env['NEXT_PUBLIC_API_URL']!;

const axiosInstance = Axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      await disconnect(wagmiConfig);

      if (getCookie(REARDEN_SESSION_ID)) {
        deleteCookie(REARDEN_SESSION_ID, { domain: process.env['NEXT_PUBLIC_SUB_DOMAIN']! });
        await axiosInstance.post(ApiRoutes.LOGOUT);
      }
    }

    return Promise.reject(err);
  },
);

export interface RetryQueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
}

export default axiosInstance;
