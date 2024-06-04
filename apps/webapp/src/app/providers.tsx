'use client';

import { Session } from 'next-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../lib/wagmi';
import { SessionProvider } from 'next-auth/react';
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to my Rearden AI',
});

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
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider>{children} </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
};
