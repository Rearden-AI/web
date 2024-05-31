'use client';

import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useEffect } from 'react';

import { ApiRoutes } from '../lib/api-routes';
import axiosInstance, { RetryQueueItem } from '../lib/axios';
import { StorageNames, getLocalStorageValue, setLocalStorageValue } from '../lib/local-storage';
import { setAxiosHeader } from '../lib/set-axios-header';

const useAxiosAuth = () => {
  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      config => setAxiosHeader(config),
      err => {
        const error = err as AxiosError;
        return Promise.reject(error);
      },
    );
    const refreshAndRetryQueue: RetryQueueItem[] = [];
    let isRefreshing = false;

    const responseIntercept = axiosInstance.interceptors.response.use(
      response => response,
      async (err: unknown) => {
        const error = err as AxiosError;
        const originalRequest = error.config as AxiosRequestConfig;
        if (error.response && error.response.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const token = getLocalStorageValue(StorageNames.ACCESS_TOKEN);
              if (token) {
                const axios = Axios.create({
                  baseURL: process.env['NEXT_PUBLIC_API_URL'],
                });
                await axios({
                  method: 'POST',
                  url: ApiRoutes.REFRESH + `?token=${token}`,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                  .then(async (response: { data: { token: string } }) => {
                    if (!response.data.token) return;

                    setLocalStorageValue(StorageNames.ACCESS_TOKEN, response.data.token);

                    return axiosInstance(originalRequest);
                  })
                  .catch(() => {
                    //TODO add disconnect
                    // if (!wallet) return;
                    // disconnect(wallet);
                    localStorage.clear();
                  });
                // Repeat all miss request by 401
                refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                  axiosInstance(config)
                    .then(response => resolve(response))
                    .catch((err: unknown) => reject(err));
                });
                refreshAndRetryQueue.length = 0;
              } else {
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(error);
              }
            } catch (refreshError) {
              refreshAndRetryQueue.length = 0;
              localStorage.clear();
            } finally {
              isRefreshing = false;
            }
          }
          return new Promise((resolve, reject) => {
            refreshAndRetryQueue.push({
              config: originalRequest,
              resolve,
              reject,
            });
          });
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosInstance;
};

export default useAxiosAuth;
