import { GetBalanceParams } from '@mysten/sui.js/client';
import { SUI_CLIENT } from './sui-client';

interface SuiServiceInterface {
  getFormattedBalance: (owner: string) => Promise<string>;
  getBalance: (parameters: GetBalanceParams) => Promise<{
    value: bigint;
    symbol: string;
    decimals: number;
  }>;
  getDecimals: (coinType: string) => Promise<number | undefined>;
}

class SuiService implements SuiServiceInterface {
  async getFormattedBalance(owner: string) {
    const res = await SUI_CLIENT.getBalance({
      owner,
    });
    return Number(Number(res.totalBalance) / 1000_000_000).toFixed(2);
  }

  async getBalance(parameters: GetBalanceParams) {
    const res = await SUI_CLIENT.getBalance(parameters);

    const metadata = await SUI_CLIENT.getCoinMetadata({
      coinType: res.coinType,
    });

    return {
      value: BigInt(res.totalBalance),
      symbol: metadata!.symbol,
      decimals: metadata!.decimals,
    };
  }

  async getDecimals(coinType: string) {
    const metadata = await SUI_CLIENT.getCoinMetadata({
      coinType,
    });

    return metadata?.decimals;
  }
}

export const suiService = new SuiService();
