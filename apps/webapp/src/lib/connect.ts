import { AxiosInstance } from 'axios';
import { toHex } from 'viem';
import { Config, Connector } from 'wagmi';
import { ConnectMutate } from 'wagmi/query';
import { ChallengeResponse, SupportedChains, TokenResponse } from '../types/auth';
import { ApiRoutes } from './api-routes';
import { StorageNames, setLocalStorageValue } from './local-storage';

export const metamaskConnect = async (
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
  setLocalStorageValue(StorageNames.ACCESS_TOKEN, data.token);
  if (connector)
    onConnect({
      connector: connector,
    });
};
