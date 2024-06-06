import {
  AuthenticationStatus,
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { SiweMessage } from 'siwe';
import axiosInstance from '../lib/axios';
import { ApiRoutes } from '../lib/api-routes';

export const RainbowKitAuthCustomProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  const [status, setStatus] = useState<AuthenticationStatus>(
    session ? 'authenticated' : 'unauthenticated',
  );

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const dat = await axiosInstance.get<string>(ApiRoutes.NONCE, {
        withCredentials: true,
      });

      return dat.data;
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

        console.log({ message, signature });

        // const verifyRes = {
        //   ok: true,
        //   message,
        //   signature,
        //   address: '0x9a868D58C7F31DAd95626e9632A937Fff69a4F0e',
        //   token: 'bbb',
        // };

        const { data } = await axiosInstance.post(
          ApiRoutes.VERIFY,
          {
            signature,
            message: JSON.stringify(message),
          },
          { withCredentials: true },
        );
        // const verifyRes = await fetch('/api/verify', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ message, signature }),
        // });

        // await signIn('credentials', {
        //   address: verifyRes.address,
        //   token: verifyRes.token,
        //   redirect: false,
        // });
        // setStatus('authenticated');
        // return Boolean(verifyRes.ok);
      } catch (error) {
        setStatus('unauthenticated');
        return false;
      }
    },

    signOut: async () => {
      await signOut();
      setStatus('unauthenticated');
    },
  });
  return (
    <RainbowKitAuthenticationProvider adapter={authenticationAdapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
};
