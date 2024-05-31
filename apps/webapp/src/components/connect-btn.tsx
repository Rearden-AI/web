'use client';

import { Button } from '@rearden/ui/components/ui/button';
import 'viem/window';
import { authService } from '../lib/auth-service';
import { useStore } from '../state';
import { accountsSelector } from '../state/accounts';
import { Dialog, DialogContent, DialogTrigger } from '@rearden/ui/components/ui/dialog';
import { useState } from 'react';
import { Icons } from '@rearden/ui/components/icons';

export const ConnectButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { selectedAccount: address } = useStore(accountsSelector);

  const copy = (text: string) => () => void navigator.clipboard.writeText(text);

  return (
    <>
      {!address ? (
        <>
          <Dialog
            open={open}
            onOpenChange={value => {
              setOpen(value);
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)} className='w-[141px]'>
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent className='flex w-[515px] flex-col items-center gap-4'>
              <div className='rounded-full bg-card p-4'>
                <Icons.wallet />
              </div>
              <p className='text-center text-xl font-bold text-muted-foreground'>
                We are creating a wallet using zkLogin technology.{' '}
              </p>
              <p className='text-center text-lg font-semibold leading-[26px]'>
                You just need to Sign In with your Google account and wallet is ready.
              </p>
              <Button
                className='flex w-[212px] items-center gap-2'
                variant='destructive'
                onClick={() => {
                  void authService.login();
                }}
              >
                <Icons.google />
                <p className='w-fit bg-primary-gradient bg-clip-text text-base  font-medium text-transparent'>
                  Continue with Google
                </p>
              </Button>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Button onClick={copy(address)} className='w-[141px]' variant='secondary'>
          {address.slice(0, 7) + '...' + address.slice(address.length - 5)}
        </Button>
      )}
    </>
  );
};
