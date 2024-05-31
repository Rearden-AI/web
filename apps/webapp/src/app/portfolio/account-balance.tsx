'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { Skeleton } from '@rearden/ui/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rearden/ui/components/ui/table';
import { getBalance, type GetBalanceReturnType } from '@wagmi/core';
import { wagmiConfig } from '../../lib/wagmi';
import { formatUnits } from 'viem';

export const AccountBalance = () => {
  const { address } = useAccount();
  const [tokens, setTokens] = useState<GetBalanceReturnType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!address) {
      setTokens([]);
      return;
    }
    void (async () => {
      const tokensRes = await Promise.all(
        [undefined, '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034' as `0x${string}`].map(async i => {
          const balance = await getBalance(wagmiConfig, {
            address,
            token: i,
            chainId: 1,
          });

          return balance;
        }),
      );
      setTokens(tokensRes);
      setLoading(false);
    })();
  }, [address]);

  return (
    <div className='flex flex-col gap-6'>
      <p className='font-satoshi text-xl font-bold'>Account balance</p>
      <div className='rounded-[4px] border border-border/40 bg-card/25 px-4 py-1'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Token</TableHead>
              <TableHead className='text-center'>Portfolio %</TableHead>
              <TableHead className='text-center'>Price (24hr)</TableHead>
              <TableHead className='text-center'>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* TODO add skeleton */}

            {!loading ? (
              tokens.map(token => (
                <TableRow key={token.symbol}>
                  <TableCell colSpan={2}>
                    <div className='flex items-center gap-2'>
                      <Image src='/ETH.png' width={30} height={30} alt='' />
                      <div className='flex flex-col gap-[2px]'>
                        <p className='font-satoshi text-base font-medium'>{token.symbol}</p>
                        <p>{token.symbol}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>-</TableCell>
                  <TableCell className='text-center'>-</TableCell>

                  <TableCell className='text-center'>{`${formatUnits(
                    token.value,
                    token.decimals,
                  )} ${token.symbol}`}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>
                  <div className='flex items-center gap-2'>
                    <div className='flex flex-col gap-[2px]'>
                      <Skeleton className='h-4 w-10' />
                      <Skeleton className='h-4  w-10' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-center'>
                    <Skeleton className='flex h-4 w-10 items-center justify-center' />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-center'>
                    <Skeleton className='flex h-4 w-10 items-center justify-center' />
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center justify-center'>
                    <Skeleton className='flex h-4 w-10 items-center justify-center' />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
