import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import {
  genAddressSeed,
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  getZkLoginSignature,
  jwtToAddress,
} from '@mysten/zklogin';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  AuthServiceInterface,
  JWTData,
  ParsedJWTData,
  PartialZkLoginSignature,
  VerificationPayload,
} from '../types/zklogin';
import { StorageNames, getLocalStorageValue, setLocalStorageValue } from './local-storage';
import { SUI_CLIENT } from './sui-client';

class AuthService implements AuthServiceInterface {
  getAddressSeed() {
    const jwt = this.decodeJwt();
    const salt = this.salt();
    if (!jwt.sub || !jwt.aud) throw new Error('jwt doesnt exist');
    return genAddressSeed(BigInt(salt), 'sub', jwt.sub, jwt.aud.toString()).toString();
  }

  getEd25519Keypair() {
    const jwtData = this.getJwtData();

    const publicKey = new Uint8Array(Object.values(jwtData.ephemeralKeyPair.keypair.publicKey));
    const secretKey = new Uint8Array(Object.values(jwtData.ephemeralKeyPair.keypair.secretKey));
    return new Ed25519Keypair({ publicKey, secretKey });
  }

  async getPartialZkLoginSignature() {
    const keyPair = this.getEd25519Keypair();
    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(keyPair.getPublicKey());

    const verificationPayload: VerificationPayload = {
      jwt: this.jwt(),
      extendedEphemeralPublicKey,
      maxEpoch: this.getMaxEpoch(),
      jwtRandomness: this.getRandomness(),
      salt: this.salt(),
      keyClaimName: 'sub',
    };

    return await this.verifyPartialZkLoginSignature(verificationPayload);
  }

  async verifyPartialZkLoginSignature(verificationPayload: VerificationPayload) {
    try {
      const { data } = await axios.post<PartialZkLoginSignature>(
        process.env['NEXT_PUBLIC_PROVER_URL']!,
        verificationPayload,
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      );

      return data;
    } catch (error) {
      return undefined;
    }
  }

  async generateZkLoginSignature(userSignature: string) {
    const partialZkLoginSignature = await this.getPartialZkLoginSignature();

    if (!partialZkLoginSignature) throw new Error('partialZkLoginSignature doesnt exist');
    const addressSeed = this.getAddressSeed();
    const maxEpoch = this.getMaxEpoch();

    return getZkLoginSignature({
      inputs: {
        ...partialZkLoginSignature,
        addressSeed,
      },
      maxEpoch,
      userSignature,
    });
  }

  getMaxEpoch() {
    return this.getJwtData().maxEpoch;
  }

  getRandomness() {
    return this.getJwtData().randomness;
  }

  private getJwtData(): ParsedJWTData {
    const jwt = getLocalStorageValue(StorageNames.JWT_DATA);
    if (!jwt) throw new Error('jwt doesnt exist');
    return JSON.parse(jwt) as ParsedJWTData;
  }

  private decodeJwt() {
    const jwt = getLocalStorageValue(StorageNames.SUI_TOKEN);
    if (!jwt) throw new Error('sui_jwt_token doesnt exist');
    return jwtDecode(jwt);
  }

  private salt() {
    const email = this.claims().email;
    if (!email) throw new Error('email doesnt exist');
    return this.hashcode(email);
  }

  walletAddress() {
    const email = this.claims().email;
    if (!email) throw new Error('email doesnt exist');
    const jwt = this.jwt();
    if (!jwt) throw new Error('jwt doesnt exist');
    return jwtToAddress(jwt, this.hashcode(email));
  }

  private claims(): { email: string } {
    const token = this.jwt();

    if (!token) throw new Error('token doesnt exist');

    return JSON.parse(atob(token.split('.')[1]!)) as { email: string };
  }

  private hashcode(s: string) {
    let h = 0,
      i = 0;
    const l = s.length;
    if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
    return h.toString().replace('-', '');
  }

  isAuthenticated() {
    const token = this.jwt();
    return Boolean(token) && token !== 'null';
  }

  jwt() {
    return getLocalStorageValue(StorageNames.SUI_TOKEN);
  }

  async login() {
    const { epoch } = await SUI_CLIENT.getLatestSuiSystemState();

    const maxEpoch = Number(epoch) + 10;
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

    ephemeralKeyPair.getPublicKey();
    ephemeralKeyPair.getSecretKey();
    const jwtData: JWTData = {
      maxEpoch,
      nonce,
      randomness,
      ephemeralKeyPair,
    };

    setLocalStorageValue(StorageNames.JWT_DATA, JSON.stringify(jwtData));

    const params = {
      client_id: process.env['NEXT_PUBLIC_OAUTH_CLIENT_ID']!,
      redirect_uri: process.env['NEXT_PUBLIC_OAUTH_REDIRECT_URL']!,
      response_type: 'id_token',
      scope: 'openid email',
      nonce: nonce,
    };

    try {
      const { data } = await axios.get<{ authorization_endpoint: string }>(
        process.env['NEXT_PUBLIC_OPENID_PROVIDER_URL']!,
      );

      const authUrl = `${data.authorization_endpoint}?${new URLSearchParams(params).toString()}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Google login:', error);
    }
  }
}

export const authService = new AuthService();
