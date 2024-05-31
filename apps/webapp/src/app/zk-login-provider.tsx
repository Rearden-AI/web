'use client';

import { useEffect } from 'react';
import useAxiosAuth from '../hooks/axios-auth';
import { ApiRoutes } from '../lib/api-routes';
import { authService } from '../lib/auth-service';
import { StorageNames, removeLocalStorageValue, setLocalStorageValue } from '../lib/local-storage';
import { useStore } from '../state';
import { accountsSelector } from '../state/accounts';
import { TokenResponse } from '../types/auth';

export const ZKLoginProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const axiosInstance = useAxiosAuth();
  const { setAccount } = useStore(accountsSelector);

  useEffect(() => {
    void (async () => {
      try {
        const params = new URLSearchParams(window.location.hash.substr(1));
        const jwtToken = params.get('id_token');
        if (!jwtToken) return;

        setLocalStorageValue(StorageNames.SUI_TOKEN, jwtToken);
        const address = authService.walletAddress();

        const { data } = await axiosInstance.post<TokenResponse>(
          ApiRoutes.AUTH + `?address=${address}&chain=SUI&signature=${address}`,
        );

        setLocalStorageValue(StorageNames.ACCESS_TOKEN, data.token);
        setAccount(address);
      } catch (error) {
        console.error('Error handling callback:', error);
        removeLocalStorageValue(StorageNames.SUI_TOKEN);
        removeLocalStorageValue(StorageNames.JWT_DATA);
      }
    })();
  }, [setAccount, axiosInstance]);

  useEffect(() => {
    try {
      const account = authService.walletAddress();
      setAccount(account);
    } catch (error) {
      //
    }
  }, [setAccount]);

  return <>{children}</>;
};
