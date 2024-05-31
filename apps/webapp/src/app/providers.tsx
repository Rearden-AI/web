'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../lib/wagmi';
import { useEffect } from 'react';
import { useStore } from '../state';
import { accountsSelector } from '../state/accounts';
import { authService } from '../lib/auth-service';
import useAxiosAuth from '../hooks/axios-auth';
import { TokenResponse } from '../types/auth';
import { ApiRoutes } from '../lib/api-routes';
import { setToken } from '../lib/token';

const queryClient = new QueryClient();

export const Providers = ({
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

        sessionStorage.setItem('sui_jwt_token', jwtToken);
        const address = authService.walletAddress();

        const { data } = await axiosInstance.post<TokenResponse>(
          ApiRoutes.AUTH + `?address=${address}&chain=SUI&signature=${address}`,
        );

        setToken(data.token);
        setAccount(address);
      } catch (error) {
        console.error('Error handling callback:', error);
        sessionStorage.removeItem('sui_jwt_token');
        sessionStorage.removeItem('jwt_data');
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

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
