'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PagePath } from '../lib/nav-routes';
import { BorderWrapper } from './border-wrapper';
import { ConnectButton } from './connect-btn';
import { Icons } from '@rearden/ui/components/icons';
import { formatUnits } from 'viem';
import { useStore } from '../state';
import { accountsSelector } from '../state/accounts';
import { suiService } from '../lib/sui-service';

export const Header = () => {
  const { selectedAccount: address } = useStore(accountsSelector);

  const [balance, setBalance] = useState<string>('0.00');

  useEffect(() => {
    if (!address) return;
    void (async () => {
      const balance = await suiService.getBalance({
        owner: address,
      });

      const formatted = formatUnits(balance.value, balance.decimals);

      setBalance(formatted);
    })();
  }, [address]);

  return (
    <BorderWrapper className='px-5 py-4'>
      <Link href={PagePath.INDEX} className='flex items-center gap-2'>
        <div className='rounded-[7px] bg-image-gradient-222deg p-px'>
          <div className='flex justify-between rounded-[7px] bg-card p-2'>
            <Icons.logo />
          </div>
        </div>
        <h2>Rearden</h2>
      </Link>
      <div className='flex items-center gap-10'>
        {address && (
          <p className='text-base font-bold'>
            Total balance:{' '}
            <span className='w-fit bg-primary-gradient bg-clip-text text-base font-bold text-transparent'>
              ${balance}
            </span>
          </p>
        )}

        <ConnectButton />
      </div>
    </BorderWrapper>
  );
};
