'use client';

import { Icons } from '@rearden/ui/components/icons';
import { cn } from '@rearden/ui/lib/utils';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { Markdown } from '../../../components/markdown';
import axiosInstance from '../../../config/axios';
import { API_ID, ApiRoutes } from '../../../constants/api-routes';
import { useStore } from '../../../state';
import { chatsSelector } from '../../../state/chats';
import { ExtendedChatSchema, HistoryMessage, Role } from '../../../types/chat';
import { StrategyMessage } from '../../../components/messages/strategy-message';
import { ResultMessage } from '../../../components/messages/result-message';
import { ChooseableActions } from '../../../components/messages/chooseable-actions';
import moment from 'moment';
import { authSelector } from '../../../state/auth';
import { redirect } from 'next/navigation';

export default function ChatPage({ params }: { params: { id: string } }) {
  const { selectedChat, selectChat } = useStore(chatsSelector);
  const { isAuth } = useStore(authSelector);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (isAuth === undefined) {
      return;
    }

    if (!isAuth) {
      selectChat(undefined);
      redirect('/');
    }
    // if chat is new than get data should not be
    if (selectedChat?.isNew && selectedChat.uuid === params.id) return;
    void (async () => {
      try {
        const { data: chat } = await axiosInstance.get<ExtendedChatSchema>(
          ApiRoutes.CHAT_BY_ID.replace(API_ID, params.id),
        );

        selectChat({ ...chat, history: chat.history });
      } catch (error) {
        redirect('/');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, selectChat, selectedChat?.isNew, isAuth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.history.length]);

  const messagesByDate = useMemo(() => {
    if (!selectedChat?.history) return [];

    const array: {
      date: string;
      items: HistoryMessage[];
    }[] = [];

    for (const message of selectedChat.history) {
      const date = moment(message.timestamp).format('MMM DD');
      const index = array.findIndex(i => i.date === date);

      if (index !== -1) {
        const prev = array[index]?.items ?? [];
        prev.push(message);
        array[index] = {
          date,
          items: prev,
        };
      } else {
        array.unshift({
          date,
          items: [message],
        });
      }
    }
    return array;
  }, [selectedChat?.history]);

  if (!selectedChat) return <></>;

  return (
    <div className='flex flex-1 flex-col-reverse pt-2'>
      <div className='scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-col-reverse overflow-y-auto'>
        <div ref={messagesEndRef} />
        {messagesByDate.map(i => (
          <div key={i.date} className='flex flex-col pb-4'>
            <div className='sticky top-0 my-4 flex justify-center'>
              <div className='flex items-center gap-1 rounded-[64px] bg-card px-4 py-1'>
                <Icons.calendar />
                <p className='text-base font-semibold text-foreground/60'>{i.date}</p>
              </div>
            </div>
            <div className='flex flex-col gap-8'>
              {i.items.map((message, index) => {
                const isCurrentUser = message.role === Role.USER;

                return (
                  <div
                    key={index}
                    className={cn('flex w-full items-end', {
                      'justify-end': isCurrentUser,
                    })}
                  >
                    <div className='flex w-4/5 flex-col gap-3 rounded-[20px] border border-border bg-card px-6 py-5'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center gap-1'>
                          <div>
                            {message.role === Role.USER ? (
                              <Icons.user />
                            ) : (
                              <div className='rounded-[4px] bg-background p-1'>
                                <Icons.logo className='size-4' />
                              </div>
                            )}
                          </div>
                          <p className='w-fit bg-primary-gradient bg-clip-text text-base font-bold text-transparent'>
                            {message.role === Role.USER ? 'You' : 'Rearden'}
                          </p>
                        </div>
                        <p className='w-fit bg-primary-gradient bg-clip-text text-sm font-semibold text-transparent'>
                          {moment(message.timestamp).format('HH:mm')}
                        </p>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <div className='flex flex-col'>
                          <Markdown markdown={message.content ?? ''} />
                        </div>
                        {message.actions?.length ? (
                          <StrategyMessage actions={message.actions} />
                        ) : (
                          <Fragment />
                        )}
                        {message.transactions?.length ? (
                          <ResultMessage result={message.transactions} />
                        ) : (
                          <Fragment />
                        )}
                        {message.chooseable_actions?.length ? (
                          <ChooseableActions actions={message.chooseable_actions} />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
