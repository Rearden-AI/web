export const Networks: Record<
  string,
  {
    name: string;
    explorer: string;
    iconUrl: string;
    contractPathname?: string;
    txPathname?: string;
  }
> = {
  // 324: {
  //   name: 'zkSync',
  //   explorer: 'https://explorer.zksync.io',
  //   iconUrl: '/ETH.png',
  // },
  eth: {
    name: 'Mainnet',
    explorer: 'https://etherscan.io',
    iconUrl: '/ETH.png',
  },
  // 17000: {
  //   name: 'Holesky',
  //   explorer: 'https://holesky.etherscan.io',
  //   iconUrl: '/ETH.png',
  // },
};
