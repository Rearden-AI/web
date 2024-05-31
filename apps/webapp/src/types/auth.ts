export enum SupportedChains {
  SOL = 'SOL',
  ETH = 'ETH',
}

export interface ChallengeResponse {
  address: string;
  chain: SupportedChains;
  valid_til: number;
  challenge: string;
}

export interface TokenResponse {
  address: string;
  chain: SupportedChains;
  valid_til: number;
  token: string;
}
