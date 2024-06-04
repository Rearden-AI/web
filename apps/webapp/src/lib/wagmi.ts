import { http } from 'wagmi';
import { holesky, mainnet, zkSync } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig } from '@wagmi/core';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet],
    },
  ],
  {
    appName: 'Rearden AI',
    projectId: 'YOUR_PROJECT_ID',
  },
);

export const wagmiConfig = createConfig({
  connectors: connectors,
  ssr: true,
  chains: [mainnet, zkSync, holesky],
  transports: {
    [mainnet.id]: http(),
    [zkSync.id]: http(),
    [holesky.id]: http(),
  },
});
