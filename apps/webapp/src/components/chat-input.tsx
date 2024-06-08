'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Icons } from '@rearden/ui/components/icons';
import { Input } from '@rearden/ui/components/ui/input';
import { cn } from '@rearden/ui/lib/utils';
import { API_ID, ApiRoutes } from '../lib/api-routes';
import { useStore } from '../state';
import { chatsSelector } from '../state/chats';
import { ChatResponse, ChatSchema, Role } from '../types/chat';
import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import axiosInstance from '../lib/axios'

export const ChatInput = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
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
            { message: input, timestamp: timestamp },
            { withCredentials: true },
          );

          writeToChat({
            role: Role.SYSTEM,
            content: data.body,
            contains_strategy_previews: data.contains_strategy_previews,
            timestamp: data.timestamp,
            action_data: data.action_data
          });
        })();
      } else {
        void (async () => {
          try {
            const { data: chat } = await axiosInstance.post<ChatSchema>(
              ApiRoutes.CHATS,
              undefined,
              { withCredentials: true },
            );

            const timestamp = Date.now();
            addChat({ ...chat, isNew: true }, input, timestamp);

            router.push(`/chat/${chat.uuid}`);

            const { data } = await axiosInstance.post<ChatResponse>(
              ApiRoutes.CHAT_BY_ID.replace(API_ID, chat.uuid),
              { message: input, timestamp },
              { withCredentials: true },
            );

            writeToChat({
              role: Role.SYSTEM,
              content: data.body,
              contains_strategy_previews: data.contains_strategy_previews,
              timestamp,
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
