import type { DefaultSession } from 'next-auth';
import { Hex } from 'viem';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    /** The user's public Ethereum address. */
    address?: Hex;
    user: DefaultSession['user'];
  }

  interface User {
    token?: string;
  }

  interface AdapterUser {
    token?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    sub: Hex;
  }
}
