import axios from 'axios';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SiweMessage } from 'siwe';
import { TokenResponse } from '../types/auth';
import { ApiRoutes } from './api-routes';

const credentialProvider = CredentialsProvider({
  async authorize(credentials) {
    if (!credentials) return null;

    try {
      const siwe = new SiweMessage(credentials.message);

      const nextAuthUrl = process.env['NEXTAUTH_URL']!;

      const nextAuthHost = new URL(nextAuthUrl).host;

      if (siwe.domain !== nextAuthHost) return null;

      const { data } = await axios.post<TokenResponse>(
        `${process.env['NEXT_PUBLIC_API_URL']}${ApiRoutes.AUTH}?message=${credentials.message}&signature=${credentials.signature}`,
      );

      return {
        id: data.address,
        token: data.token,
      };
    } catch (e) {
      return null;
    }
  },
  credentials: {
    message: {
      label: 'Message',
      placeholder: '0x0',
      type: 'text',
    },
    signature: {
      label: 'Signature',
      placeholder: '0x0',
      type: 'text',
    },
  },
  name: 'Ethereum',
});

export const authOptions: AuthOptions = {
  providers: [credentialProvider],
  callbacks: {
    jwt({ token, user }) {
      if (user.token) {
        token.accessToken = user.token;
      }

      return token;
    },
    session({ session, token }) {
      session.address = token.sub;
      session.user = {
        name: token.sub,
      };
      session.token = token.accessToken;

      return session;
    },
  },
  secret: process.env['NEXTAUTH_SECRET'],
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions) as unknown;

export { handler as GET, handler as POST };
