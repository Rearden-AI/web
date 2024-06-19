import Axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = Axios.create({
  baseURL: process.env['NEXT_PUBLIC_API_URL'],
  withCredentials: true,
});

export interface RetryQueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
}

export default axiosInstance;
