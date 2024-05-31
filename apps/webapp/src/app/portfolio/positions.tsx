import Image from 'next/image';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rearden/ui/components/ui/table';

export const Positions = () => {
  return (
    <div className='flex flex-col gap-6'>
      <p className='font-satoshi text-xl font-bold'>Positions</p>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Image src='/ETH.png' width={18} height={18} alt='' />
            <p>Lido</p>
          </div>
          <div className='rounded-[4px] border border-border/40 bg-card/25 px-4 py-1'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead />
                  <TableHead className='text-center'>Balance</TableHead>
                  <TableHead className='text-center'>APY</TableHead>
                  <TableHead className='text-center'>USD Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='h-[50px]'>
                    <div className='flex items-center gap-2'>
                      <Image src='/ETH.png' width={30} height={30} alt='' />
                      <p className='font-satoshi text-base'>stETH</p>
                    </div>
                  </TableCell>
                  <TableCell className='h-[50px] font-satoshi text-base'></TableCell>
                  <TableCell className='h-[50px]'>10.000 stETH</TableCell>
                  <TableCell className='h-[50px]'>1 %</TableCell>
                  <TableCell className='h-[50px]'>1 %</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
