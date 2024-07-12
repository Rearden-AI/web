import axiosInstance from '../config/axios';
import { ApiRoutes } from '../constants/api-routes';
import { deleteCookie, getCookie } from 'cookies-next';
import { useAccountEffect, useDisconnect } from 'wagmi';
import { useStore } from '../state';
import { authSelector } from '../state/auth';
import { useEffect } from 'react';
import { getAccount } from '@wagmi/core';
import { wagmiConfig } from '../config/wagmi';
import { REARDEN_SESSION_ID } from '../constants/constants';
import { chatsSelector } from '../state/chats';

export const CheckIsAuth = ({ children }: { children: React.ReactNode }) => {
  const { setAuth, setStatus } = useStore(authSelector);
  const { clearChats } = useStore(chatsSelector);
  const { disconnect } = useDisconnect();

  useAccountEffect({
    async onConnect() {
      const cookie = getCookie(REARDEN_SESSION_ID);

      if (!cookie) return;
      await axiosInstance.get<string>(ApiRoutes.ME);

      setStatus('authenticated');
      setAuth(true);
    },
    async onDisconnect() {
      const cookie = getCookie(REARDEN_SESSION_ID);

      if (cookie) {
        try {
          await axiosInstance.post(ApiRoutes.LOGOUT);
        } catch (error) {
          //
        }
        deleteCookie(REARDEN_SESSION_ID, {
          domain: process.env['NEXT_COOKIE_SUB_DOMAIN']!,
        });
      }

      setStatus('unauthenticated');
      setAuth(false);
      clearChats();
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const account = getAccount(wagmiConfig);
      const cookie = getCookie(REARDEN_SESSION_ID);

      if (!account.address) {
        void (async () => {
          const cookie = getCookie(REARDEN_SESSION_ID);

          if (cookie) {
            try {
              await axiosInstance.post(ApiRoutes.LOGOUT);
            } catch (error) {
              //
            }
            deleteCookie(REARDEN_SESSION_ID);
            setStatus('unauthenticated');
            setAuth(false);
            clearChats();
          }
        })();
      }

      if (!cookie) {
        disconnect();
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
