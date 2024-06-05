import {
  AuthenticationStatus,
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { SiweMessage } from 'siwe';

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
      return '3cac1c2025bc0783c0673cee247c6e7ef9a407b030a31e8d1aec44903acf8d1e';
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

        const verifyRes = {
          ok: true,
          message,
          signature,
          address: '0x9a868D58C7F31DAd95626e9632A937Fff69a4F0e',
          token: 'bbb',
        };
        // const verifyRes = await fetch('/api/verify', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ message, signature }),
        // });

        await signIn('credentials', {
          address: verifyRes.address,
          token: verifyRes.token,
          redirect: false,
        });
        setStatus('authenticated');
        return Boolean(verifyRes.ok);
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
