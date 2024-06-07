'use client';

import { Session } from 'next-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../lib/wagmi';
import { SessionProvider } from 'next-auth/react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { rainbowTheme } from '../lib/rainbow-theme';
import { RainbowKitAuthCustomProvider } from './rainbow-kit-auth-custom';

const queryClient = new QueryClient();

export const Providers = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  return (
    <SessionProvider refetchInterval={0} session={session}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitAuthCustomProvider session={session}>
            <RainbowKitProvider theme={rainbowTheme}>{children} </RainbowKitProvider>
          </RainbowKitAuthCustomProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
};
