import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@rearden/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rearden/ui/components/ui/dialog';
import useAxiosAuth from '../../hooks/axios-auth';
import { API_ID, ApiRoutes } from '../../lib/api-routes';
import { PagePath } from '../../lib/nav-routes';
import { useStore } from '../../state';
import { chatsSelector } from '../../state/chats';
import { ChatSchema } from '../../types/chat';

export const ApproveDeleteModal = ({ chat }: { chat: ChatSchema }) => {
  const router = useRouter();
  const axiosInstance = useAxiosAuth();
  const params = useParams<{ id?: string }>();
  const { removeChat } = useStore(chatsSelector);

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <button
          className='flex items-center justify-start gap-2 px-4 py-[9px] text-[12px] font-medium leading-[18px] text-foreground'
          onClick={e => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <div>
            <Trash className='size-4' />
          </div>
          <p>Delete chat</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete chat?</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-6 pt-3'>
          <p className='text-[12px] font-medium leading-[18px]'>This will delete “{chat.name}”</p>
          <div className='flex gap-[10px] self-end'>
            <Button
              className='w-[90px]'
              variant='secondary'
              size='sm'
              onClick={e => {
                e.preventDefault();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className='w-[90px]'
              size='sm'
              onClick={e => {
                e.preventDefault();
                void (async () => {
                  await axiosInstance.delete(ApiRoutes.CHAT_BY_ID.replace(API_ID, chat.uuid));
                  removeChat(chat.uuid);
                  params.id === chat.uuid && router.push(PagePath.INDEX);
                  setOpen(false);
                })();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
