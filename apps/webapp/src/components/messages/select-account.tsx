'use client';

import { useMemo, useState } from 'react';

import { Action } from '../../types/chat';
import { BorderWrapper } from '../border-wrapper';
import { Icons } from '@rearden/ui/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rearden/ui/components/ui/select';
import { ActionsModal } from './actions-modal';
import { useAccount } from 'wagmi';

interface SelectAccountProps {
  strategies: Action[];
}

export const SelectAccount = ({ strategies }: SelectAccountProps) => {
  const { address } = useAccount();
  const [wallet, setWallet] = useState('');

  const accounts = useMemo(() => {
    if (!address) return [];
    return [
      {
        label: (
          <div className='flex items-center gap-3'>
            <div>
              <Icons.user />
            </div>
            <p className='text-base font-semibold'>{address}</p>
          </div>
        ),
        value: address,
      },
    ];
  }, [address]);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex w-full flex-col gap-[6px]'>
        <p className='text-sm font-bold'>Select wallet</p>
        <BorderWrapper wrapperClassName='bg-image-gradient-secondary-101deg'>
          <Select
            defaultValue={wallet}
            onValueChange={value => {
              setWallet(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select account' />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((i, index) => (
                <SelectItem value={i.value} key={index}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </BorderWrapper>
      </div>
      <ActionsModal wallet={wallet} strategies={strategies} />
    </div>
  );
};
