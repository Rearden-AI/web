'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { Icons } from '@rearden/ui/components/icons';
import { Input } from '@rearden/ui/components/ui/input';
import { cn } from '@rearden/ui/lib/utils';
import axiosInstance from '../config/axios';
import { API_ID, ApiRoutes } from '../constants/api-routes';
import { useStore } from '../state';
import { chatsSelector } from '../state/chats';
import { ChatResponse, ChatSchema, Role } from '../types/chat';
import { useChainId } from 'wagmi';

export const ChatInput = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const chain = useChainId();
  const { writeToChat, addChat, renameChat } = useStore(chatsSelector);
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();

  const [input, setInput] = useState('');
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    setInput('');
  }, [pathname]);

  const createOrEditChat = () => {
    if (!input) return;

    const chatId = params.id;

    try {
      if (pathname.includes('/chat') && chatId) {
        const timestamp = Date.now();
        writeToChat({
          role: Role.USER,
          content: input,
          timestamp,
        });
        void (async () => {
          const { data } = await axiosInstance.post<ChatResponse>(
            ApiRoutes.CHAT_BY_ID.replace(API_ID, chatId),
            { message: input, timestamp, chain_id: chain },
          );

          writeToChat({
            role: Role.SYSTEM,
            content: data.body,
            ...data,
          });
        })();
      } else {
        void (async () => {
          try {
            const { data: chat } = await axiosInstance.post<ChatSchema>(ApiRoutes.CHATS, {
              chain_id: chain,
            });

            const timestamp = Date.now();
            addChat({ ...chat, isNew: true }, input, timestamp);

            router.push(`/chat/${chat.uuid}`);

            const { data } = await axiosInstance.post<ChatResponse>(
              ApiRoutes.CHAT_BY_ID.replace(API_ID, chat.uuid),
              { message: input, timestamp, chain_id: chain },
            );

            writeToChat({
              role: Role.SYSTEM,
              content: data.body,
              ...data,
            });

            renameChat(chat.uuid, data.body ? data.body.slice(0, 31) : 'New Chat');
          } catch (error) {
            console.log(error);
          }
        })();
      }
    } catch (error) {
      console.log(error);
    }
    setInput('');
  };

  return (
    <BorderWrapper
      wrapperClassName={cn(
        'cursor-text rounded-[18px]',
        focus ? 'bg-primary-gradient' : 'bg-image-gradient-secondary-101deg',
      )}
      className='flex items-center rounded-[18px] px-6 py-2'
      tabIndex={-1}
      onFocus={() => {
        setFocus(true);
        inputRef.current?.focus();
      }}
      onBlur={() => setFocus(false)}
    >
      <p
        className={cn(
          'text-lg font-semibold leading-[26px]',
          focus ? 'text-muted-foreground font-semibold' : 'font-medium',
        )}
      >
        Message to Rearden
      </p>
      <Input
        onChange={e => setInput(e.target.value)}
        value={input}
        type='text'
        className={cn('text-muted-foreground h-11 flex-1 border-none bg-transparent outline-none')}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            createOrEditChat();
          }
        }}
        ref={inputRef}
      />
      <button
        onClick={e => {
          e.preventDefault();
          createOrEditChat();
        }}
        disabled={!input}
        className={cn(
          'bg-background flex h-11 cursor-pointer items-center justify-center rounded-lg px-2 disabled:opacity-40',
          !focus && 'opacity-40',
          focus && input && 'hover:bg-image-gradient-101deg',
        )}
      >
        <Icons.send />
      </button>
    </BorderWrapper>
  );
};
