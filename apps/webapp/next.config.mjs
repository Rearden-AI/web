/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  webpack: config => {
    // Solve 'Module not found: Can't resolve 'lokijs' 'pino-pretty' 'encoding'!' from walletconnect
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.coinranking.com',
      },
    ],
  },
};

export default nextConfig;
