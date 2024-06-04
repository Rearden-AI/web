'use client';

import { Button } from '@rearden/ui/components/ui/button';
import 'viem/window';
import { useAccount, useConnect } from 'wagmi';
import useAxiosAuth from '../hooks/axios-auth';
import { ApiRoutes } from '../lib/api-routes';
import { ChallengeResponse, SupportedChains, TokenResponse } from '../types/auth';
import { toHex } from 'viem';
import { StorageNames, setLocalStorageValue } from '../lib/local-storage';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectButton = () => {
  // const axiosInstance = useAxiosAuth();
  // const { address } = useAccount();
  // const { connect, connectors } = useConnect();

  // const copy = (text: string) => () => void navigator.clipboard.writeText(text);

  // const metamaskConnect = () => {
  //   void (async () => {
  //     if (!window.ethereum) throw new Error('Metamask is not installed');
  //     const addresses = await window.ethereum.request({
  //       method: 'eth_requestAccounts',
  //     });
  //     const address = addresses[0];
  //     if (!address) throw new Error('Metamask doesnt return address');
  //     const { data: challenge } = await axiosInstance.post<ChallengeResponse>(
  //       ApiRoutes.CHALLENGE + `?address=${address}&chain=${SupportedChains.ETH}`,
  //     );
  //     const signMessage = toHex(challenge.challenge);
  //     const signature = await window.ethereum.request({
  //       method: 'personal_sign',
  //       params: [signMessage, address],
  //     });
  //     const { data } = await axiosInstance.post<TokenResponse>(
  //       ApiRoutes.AUTH + `?address=${address}&chain=${SupportedChains.ETH}&signature=${signature}`,
  //     );
  //     setLocalStorageValue(StorageNames.ACCESS_TOKEN, data.token);
  //     if (connectors[0])
  //       connect({
  //         connector: connectors[0],
  //       });
  //   })();
  // };
  return <RainbowConnectButton />;
};
