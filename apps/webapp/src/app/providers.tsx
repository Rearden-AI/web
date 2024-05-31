'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../lib/wagmi';
import { ZKLoginProvider } from './zk-login-provider';

const queryClient = new QueryClient();

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ZKLoginProvider>{children}</ZKLoginProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
