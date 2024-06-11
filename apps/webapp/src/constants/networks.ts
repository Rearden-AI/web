export const Networks: Record<
  number,
  {
    name: string;
    explorer: string;
    iconUrl: string;
    contractPathname?: string;
    txPathname?: string;
  }
> = {
  324: {
    name: 'zkSync',
    explorer: 'https://explorer.zksync.io',
    iconUrl: '/ETH.png',
  },
  1: {
    name: 'Mainnet',
    explorer: 'https://etherscan.io',
    iconUrl: '/ETH.png',
  },
  17000: {
    name: 'Holesky',
    explorer: 'https://holesky.etherscan.io',
    iconUrl: '/ETH.png',
  },
};
