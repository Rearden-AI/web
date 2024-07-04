import { disconnect } from '@wagmi/core';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { wagmiConfig } from './wagmi';
import { signOut } from 'next-auth/react';

const axiosInstance = Axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'],
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    const err = error as AxiosError;
    console.log(error);

    // useStore().auth.setStatus('unauthenticated');
    // await axiosInstance.post(ApiRoutes.LOGOUT);
    await disconnect(wagmiConfig);
    await signOut();
    // const status = err.response ? err.response.status : null;

    // if (status === 401) {
    //   useStore().auth.setStatus('unauthenticated');
    //   await axiosInstance.post(ApiRoutes.LOGOUT);
    //   await disconnect(wagmiConfig);
    //   await signOut();
    // } else if (status === 404) {
    //   // Handle not found errors
    // } else {
    //   // Handle other errors
    // }

    return Promise.reject(err);
  },
);

export interface RetryQueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
}

export default axiosInstance;
