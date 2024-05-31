import { createConfig, http } from 'wagmi';
import { holesky, mainnet, zkSync } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

const connectors = [injected()];

export const wagmiConfig = createConfig({
  chains: [mainnet, zkSync, holesky],
  transports: {
    [mainnet.id]: http(),
    [zkSync.id]: http(),
    [holesky.id]: http(),
  },
  ssr: true,
  connectors,
});
