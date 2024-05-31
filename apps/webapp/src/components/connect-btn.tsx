'use client';

import { Button } from '@rearden/ui/components/ui/button';
import 'viem/window';
import { authService } from '../lib/auth-service';
import { useStore } from '../state';
import { accountsSelector } from '../state/accounts';

export const ConnectButton = () => {
  const { selectedAccount: address } = useStore(accountsSelector);

  const handleConnect = () => void authService.login();

  const copy = (text: string) => () => void navigator.clipboard.writeText(text);

  return (
    <Button
      onClick={!address ? handleConnect : copy(address)}
      className='w-[141px]'
      variant={address ? 'secondary' : 'default'}
    >
      {address ? address.slice(0, 7) + '...' + address.slice(address.length - 5) : 'Connect'}
    </Button>
  );
};
