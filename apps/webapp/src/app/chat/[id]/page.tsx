'use client';

import { Icons } from '@rearden/ui/components/icons';
import { cn } from '@rearden/ui/lib/utils';
import { Fragment, useEffect, useRef } from 'react';
import { ExecuteButton } from '../../../components/execute-button';
import { Markdown } from '../../../components/markdown';
import axiosInstance from '../../../config/axios';
import { API_ID, ApiRoutes } from '../../../constants/api-routes';
import { useStore } from '../../../state';
import { chatsSelector } from '../../../state/chats';
import { ChatResponse, ExtendedChatSchema, Role } from '../../../types/chat';
import { StrategyMessage } from '../../../components/messages/strategy-message';

export default function ChatPage({ params }: { params: { id: string } }) {
  const { selectedChat, writeToChat, selectChat } = useStore(chatsSelector);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat?.isNew && selectedChat.uuid === params.id) return;
    void (async () => {
      try {
        const { data: chat } = await axiosInstance.get<ExtendedChatSchema>(
          ApiRoutes.CHAT_BY_ID.replace(API_ID, params.id),
          { withCredentials: true },
        );

        selectChat({ ...chat, history: chat.history.reverse() });
      } catch (error) {
        //
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, selectChat, selectedChat?.isNew]);

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
                                timestamp: data.timestamp,
                                action_data: data.action_data,
                              });
                            } catch (error) {
                              //
                            }
                          })();
                        }}
                      />
                    ) : (
                      <Fragment />
                    )}
                  </div>
                  {message.action_data ? (
                    <StrategyMessage strategies={[message.action_data]} />
                  ) : (
                    <Fragment />
                  )}
                  {/*{message.transactions?.length ? (
                    <ResultMessage result={message.transactions} />
                  ) : (
                    <Fragment />
                  )} */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
