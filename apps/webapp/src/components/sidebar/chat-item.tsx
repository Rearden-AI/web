import { Icons } from '@rearden/ui/components/icons';
import { Input } from '@rearden/ui/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@rearden/ui/components/ui/popover';
import { cn } from '@rearden/ui/lib/utils';
import { Pencil, Share } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '../../config/axios';
import { API_ID, ApiRoutes } from '../../constants/api-routes';
import { ID, PagePath } from '../../constants/nav-routes';
import { useStore } from '../../state';
import { chatsSelector } from '../../state/chats';
import { ChatSchema } from '../../types/chat';
import { ApproveDeleteModal } from './approve-delete-modal';
import { useChainId } from 'wagmi';

export const ChatItem = ({ chat }: { chat: ChatSchema }) => {
  const params = useParams<{ id?: string }>();
  const chain = useChainId();

  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState('');
  const { renameChat } = useStore(chatsSelector);

  useEffect(() => {
    setName(chat.name ?? '');
  }, [chat.name]);

  const handleRename = () => {
    void (async () => {
      await axiosInstance.patch(ApiRoutes.CHAT_BY_ID.replace(API_ID, chat.uuid), {
        name: name || null,
        chain_id: chain,
      });
      setEditMode(false);
      renameChat(chat.uuid, name);
    })();
  };

  return (
    <>
      {editMode ? (
        <Input
          onBlur={handleRename}
          autoFocus
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          onKeyDown={e => {
            if (e.code === 'Enter') {
              handleRename();
            }
          }}
        />
      ) : (
        <Link
          href={PagePath.CHAT_DETAILS.replace(ID, chat.uuid)}
          className={cn(
            'group flex items-center justify-between gap-3 hover:opacity-50',
            (params.id === chat.uuid || open) && 'opacity-50',
          )}
        >
          <p className='text-base font-medium'>{chat.name ?? 'New Chat'}</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              asChild
              className={cn(
                'opacity-0 group-hover:opacity-100',
                (params.id === chat.uuid || open) && 'opacity-100',
              )}
            >
              <button
                onClick={e => {
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                <Icons.ellipsis className='size-4' />
              </button>
            </PopoverTrigger>
            <PopoverContent className='flex flex-col'>
              <button
                className='flex items-center justify-start gap-2 px-4 py-[9px] text-[12px] font-medium leading-[18px] text-foreground disabled:cursor-not-allowed'
                disabled
              >
                <div>
                  <Share className='size-4' />
                </div>
                <p>Share</p>
              </button>
              <button
                className='flex items-center justify-start gap-2 border-y border-border-secondary px-4 py-[9px] text-[12px] font-medium leading-[18px] text-foreground'
                onClick={e => {
                  e.preventDefault();
                  setEditMode(true);
                  setOpen(false);
                }}
              >
                <div>
                  <Pencil className='size-4' />
                </div>
                <p>Rename</p>
              </button>
              <ApproveDeleteModal chat={chat} />
            </PopoverContent>
          </Popover>
        </Link>
      )}
    </>
  );
};
