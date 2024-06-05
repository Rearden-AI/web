import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider, { CredentialsConfig } from 'next-auth/providers/credentials';

const credentialProvider: CredentialsConfig = CredentialsProvider({
  async authorize(credentials) {
    if (!credentials) return null;

    try {
      return {
        id: credentials.address,
        token: credentials.token,
      };
    } catch (e) {
      return null;
    }
  },
  credentials: {
    address: {
      label: 'Address',
      placeholder: '0x0',
      type: 'text',
    },
    token: {
      label: 'Token',
      placeholder: 'token',
      type: 'text',
    },
  },
});

export const authOptions: AuthOptions = {
  providers: [credentialProvider],
  callbacks: {
    jwt({ token, user }) {
      if (user && user.token) {
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

// next-auth has no strict types
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
