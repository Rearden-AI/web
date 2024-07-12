import {
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import React from 'react';
import { SiweMessage } from 'siwe';
import axiosInstance from '../config/axios';
import { ApiRoutes } from '../constants/api-routes';
import { useStore } from '../state';
import { authSelector } from '../state/auth';

export const RainbowKitAuthCustomProvider = ({ children }: { children: React.ReactNode }) => {
  const { status, setStatus, setAuth } = useStore(authSelector);

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const { data } = await axiosInstance.get<string>(ApiRoutes.NONCE);

      return data;
    },

    createMessage: ({ nonce, address, chainId }) => {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      return message;
    },

    getMessageBody: ({ message }) => message.prepareMessage(),

    verify: async ({ message, signature }) => {
      try {
        setStatus('loading');

        const { data } = await axiosInstance.post<boolean>(ApiRoutes.VERIFY, {
          signature,
          message: message.prepareMessage(),
        });

        setStatus('authenticated');
        setAuth(true);
        return data;
      } catch (error) {
        console.log(error);
        setAuth(false);
        setStatus('unauthenticated');
        return false;
      }
    },

    // eslint-disable-next-line @typescript-eslint/require-await
    signOut: async () => {
      setStatus('unauthenticated');
    },
  });
  return (
    <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
};
