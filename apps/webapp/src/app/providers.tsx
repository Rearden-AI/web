'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { rainbowTheme } from '../config/rainbow-theme';
import { wagmiConfig } from '../config/wagmi';
import { RainbowKitAuthCustomProvider } from './rainbow-kit-auth-custom';
import { CheckIsAuth } from './check-is-auth';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CheckIsAuth>
          <RainbowKitAuthCustomProvider>
            <RainbowKitProvider theme={rainbowTheme}>{children} </RainbowKitProvider>
          </RainbowKitAuthCustomProvider>
        </CheckIsAuth>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
