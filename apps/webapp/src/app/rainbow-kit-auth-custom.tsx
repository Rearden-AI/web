import {
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import { getSession, signIn, signOut } from 'next-auth/react';
import React, { useEffect } from 'react';
import { SiweMessage } from 'siwe';
import axiosInstance from '../config/axios';
import { ApiRoutes } from '../constants/api-routes';
import { useStore } from '../state';
import { authSelector } from '../state/auth';
import { getAccount } from '@wagmi/core';
import { wagmiConfig } from '../config/wagmi';

export const RainbowKitAuthCustomProvider = ({ children }: { children: React.ReactNode }) => {
  const { status, setStatus } = useStore(authSelector);

  useEffect(() => {
    const interval = setInterval(() => {
      void (async () => {
        const account = getAccount(wagmiConfig);
        const session = await getSession();

        setStatus(account.address && session ? 'authenticated' : 'unauthenticated');

        session && !account.address && (await signOut());

        account.address && session && clearInterval(interval);
      })();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        await signIn('credentials', {
          address: message.address,
          redirect: false,
        });
        setStatus('authenticated');
        return data;
      } catch (error) {
        setStatus('unauthenticated');
        return false;
      }
    },

    signOut: async () => {
      await axiosInstance.post(ApiRoutes.LOGOUT);
      setStatus('unauthenticated');
      await signOut();
    },
  });
  return (
    <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
};
