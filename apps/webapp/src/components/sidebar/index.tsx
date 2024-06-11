'use client';

import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { Icons } from '@rearden/ui/components/icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import axiosInstance from '../../config/axios';
import { ApiRoutes } from '../../constants/api-routes';
import { PagePath, sidebarLinks } from '../../constants/nav-routes';
import { filterUniqueByKey } from '../../lib/filter-unique-by-key';
import { useStore } from '../../state';
import { chatsSelector } from '../../state/chats';
import { ChatSchema } from '../../types/chat';
import { PaginatedResponse } from '../../types/generic';
import { ChatItem } from './chat-item';

const getChats = async ({
  pageParam,
  prevChats,
}: {
  pageParam: number;
  prevChats: ChatSchema[];
}) => {
  const { data: response } = await axiosInstance.get<PaginatedResponse<ChatSchema[]>>(
    ApiRoutes.CHATS + `?page_number=${pageParam}&page_size=15`,
    { withCredentials: true },
  );

  return filterUniqueByKey<ChatSchema>(response.data, prevChats, 'uuid');
};

export const Sidebar = () => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { all, addChats } = useStore(chatsSelector);
  const { data: session } = useSession();

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['chats'],
    enabled: Boolean(session?.address),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getChats({ pageParam, prevChats: all }),
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
  });

  useEffect(() => {
    if (!data?.pages) return;

    const chats = data.pages[data.pages.length - 1];
    if (!chats) return;

    addChats(chats);
  }, [data?.pages, addChats]);

  useEffect(() => {
    if (!session?.address) return;
    const observer = new IntersectionObserver(entries => {
      const target = entries[0];
      if (target?.isIntersecting) {
        void fetchNextPage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchNextPage, session]);

  return (
    <BorderWrapper
      className='w-[266px] flex-col justify-between overflow-y-auto'
      wrapperClassName='hidden md:flex'
    >
      <div className='flex flex-col gap-0 p-3'>
        {sidebarLinks.map(i =>
          i.active ? (
            <Link key={i.href} href={i.href} className='flex items-center gap-2 p-3'>
              <div>{i.icon}</div>
              <p className='text-base font-semibold capitalize'>{i.title}</p>
            </Link>
          ) : (
            <button
              key={i.href}
              className='flex items-center gap-2 p-3 disabled:cursor-not-allowed'
              disabled
            >
              <div>{i.icon}</div>
              <p className='text-base font-semibold capitalize'>{i.title}</p>
            </button>
          ),
        )}
        <div className='flex flex-col gap-3 rounded-md bg-background p-3'>
          <Link href={PagePath.INDEX} className='flex items-center justify-between'>
            <div className='flex items-center gap-[6px]'>
              <div>
                <Icons.chat_gradient />
              </div>
              <p className='w-fit bg-primary-gradient bg-clip-text text-base font-bold text-transparent'>
                Chat
              </p>
            </div>
            <div>
              <Icons.plus />
            </div>
          </Link>
          <div className='scrollbar-thumb-rounded scrollbar-track-black-lighter scrollbar-w-2 scrolling-touch flex max-h-[400px] flex-col gap-2 overflow-y-auto'>
            {all.length ? (
              <>
                {all.map(i => (
                  <div key={i.uuid}>
                    <ChatItem chat={i} />
                  </div>
                ))}
              </>
            ) : (
              <></>
            )}
            <div ref={loaderRef} />
          </div>
        </div>
      </div>
    </BorderWrapper>
  );
};
