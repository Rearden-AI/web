import {
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import { signIn, signOut } from 'next-auth/react';
import React from 'react';
import { SiweMessage } from 'siwe';
import axiosInstance from '../config/axios';
import { ApiRoutes } from '../constants/api-routes';
import { Session } from 'next-auth';
import { useStore } from '../state';
import { authSelector } from '../state/auth';

export const RainbowKitAuthCustomProvider = ({
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  const { status, setStatus } = useStore(authSelector);

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
        console.log(error);

        setStatus('unauthenticated');
        return false;
      }
    },

    signOut: async () => {
      setStatus('unauthenticated');
      await signOut({
        redirect: false,
      });
    },
  });
  return (
    <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
};
