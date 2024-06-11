'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { WagmiProvider } from 'wagmi';
import { rainbowTheme } from '../config/rainbow-theme';
import { wagmiConfig } from '../config/wagmi';

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
          {/* <RainbowKitAuthCustomProvider session={session}> */}
          <RainbowKitProvider theme={rainbowTheme}>{children} </RainbowKitProvider>
          {/* </RainbowKitAuthCustomProvider> */}
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
};
