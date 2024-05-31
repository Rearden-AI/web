import { AxiosInstance } from 'axios';
import { ApiRoutes } from './api-routes';
import { ChallengeResponse, SupportedChains, TokenResponse } from '../types/auth';
import { toHex } from 'viem';
import { setToken } from './token';
import { Config, Connector } from 'wagmi';
import { ConnectMutate } from 'wagmi/query';

export const connect = async (
  axiosInstance: AxiosInstance,
  onConnect: ConnectMutate<Config>,
  connector?: Connector,
) => {
  if (!window.ethereum) throw new Error('Metamask is not installed');
  const addresses = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  const address = addresses[0];
  if (!address) throw new Error('Metamask doesnt return address');
  const { data: challenge } = await axiosInstance.post<ChallengeResponse>(
    ApiRoutes.CHALLENGE + `?address=${address}&chain=${SupportedChains.ETH}`,
  );
  const signMessage = toHex(challenge.challenge);
  const signature = await window.ethereum.request({
    method: 'personal_sign',
    params: [signMessage, address],
  });
  const { data } = await axiosInstance.post<TokenResponse>(
    ApiRoutes.AUTH + `?address=${address}&chain=${SupportedChains.ETH}&signature=${signature}`,
  );
  setToken(data.token);
  if (connector)
    onConnect({
      connector: connector,
    });
};
