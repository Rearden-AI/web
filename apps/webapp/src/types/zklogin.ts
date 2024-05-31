import { getZkLoginSignature } from '@mysten/zklogin';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

export type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>['0']['inputs'],
  'addressSeed'
>;

export interface VerificationPayload {
  jwt: string | null;
  extendedEphemeralPublicKey: string;
  maxEpoch: number;
  jwtRandomness: string;
  salt: string;
  keyClaimName: 'sub';
}

export interface AuthServiceInterface {
  getAddressSeed: () => void;
  getEd25519Keypair: () => Ed25519Keypair;
  getPartialZkLoginSignature: () => Promise<PartialZkLoginSignature | undefined>;
  verifyPartialZkLoginSignature: (
    verificationPayload: VerificationPayload,
  ) => Promise<PartialZkLoginSignature | undefined>;
  generateZkLoginSignature: (userSignature: string) => Promise<string>;
  getMaxEpoch: () => number;
  getRandomness: () => string;
  login: () => Promise<void>;
  walletAddress: () => string;
  isAuthenticated: () => boolean;
  jwt: () => string | null;
}

export interface JWTData {
  maxEpoch: number;
  nonce: string;
  randomness: string;
  ephemeralKeyPair: Ed25519Keypair;
}

export interface ParsedJWTData {
  maxEpoch: number;
  nonce: string;
  randomness: string;
  ephemeralKeyPair: {
    keypair: {
      publicKey: Record<number, number>;
      secretKey: Record<number, number>;
    };
  };
}
