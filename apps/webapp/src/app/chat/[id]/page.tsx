'use client';

import { Icons } from '@rearden/ui/components/icons';
import { cn } from '@rearden/ui/lib/utils';
import { Fragment, useEffect, useRef } from 'react';
import { ExecuteButton } from '../../../components/execute-button';
import { Markdown } from '../../../components/markdown';
import { ResultMessage } from '../../../components/messages/result-message';
import { StrategyMessage } from '../../../components/messages/strategy-message';
import useAxiosAuth from '../../../hooks/axios-auth';
import { API_ID, ApiRoutes } from '../../../lib/api-routes';
import { useStore } from '../../../state';
import { chatsSelector } from '../../../state/chats';
import { ChatResponse, ExtendedChatSchema, Role } from '../../../types/chat';

export default function ChatPage({ params }: { params: { id: string } }) {
  const { selectedChat, writeToChat, selectChat } = useStore(chatsSelector);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const axiosInstance = useAxiosAuth();

  useEffect(() => {
    if (selectedChat?.isNew && selectedChat.uuid === params.id) return;
    void (async () => {
      try {
        const { data: chat } = await axiosInstance.get<ExtendedChatSchema>(
          ApiRoutes.CHAT_BY_ID.replace(API_ID, params.id),
        );

        selectChat({ ...chat, history: chat.history.reverse() });
      } catch (error) {
        //
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosInstance, params.id, selectChat, selectedChat?.isNew]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.history.length]);

  if (!selectedChat) return <></>;

  return (
    <div className='flex flex-1 flex-col-reverse pt-2'>
      <div className='scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-col-reverse gap-8 overflow-y-auto'>
        <div ref={messagesEndRef} />
        {selectedChat.history.map((message, index) => {
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
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-col'>
                    <Markdown markdown={message.content ?? ''} />
                    {message.contains_strategy_previews?.length ? (
                      <ExecuteButton
                        onClick={() => {
                          void (async () => {
                            try {
                              const { data } = await axiosInstance.post<ChatResponse>(
                                ApiRoutes.CHAT_BY_ID.replace(API_ID, params.id),
                                {
                                  generate_code: message.contains_strategy_previews,
                                  message: '',
                                  timestamp: Date.now(),
                                },
                              );

                              await axiosInstance.post(ApiRoutes.STRATEGY_EXECUTIONS, {
                                chat_uuid: params.id,
                              });

                              writeToChat({
                                role: Role.SYSTEM,
                                content: data.body,
                                strategies: data.strategies,
                                timestamp: data.timestamp,
                              });
                            } catch (error) {
                              console.log(error);
                            }
                          })();
                        }}
                      />
                    ) : (
                      <Fragment />
                    )}
                  </div>
                  {message.strategies?.length ? (
                    <StrategyMessage strategies={message.strategies} />
                  ) : (
                    <Fragment />
                  )}
                  {message.transactions?.length ? (
                    <ResultMessage result={message.transactions} />
                  ) : (
                    <Fragment />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
