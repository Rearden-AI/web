import moment from 'moment';
import Image from 'next/image';
import { Icons } from '@rearden/ui/components/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rearden/ui/components/ui/table';
import { TransactionResult } from '../../types/transactions';
import { ActionTypeCard } from '../action-type-card';

export const ResultMessage = ({ result }: { result: TransactionResult[] }) => {
  return (
    <div className='flex flex-col gap-3'>
      <p className='text-lg font-bold leading-[26px]'>Transactions details</p>
      <div className='mb-3 flex flex-col gap-1'>
        <p className='text-sm font-bold'>Account</p>
        <div className='flex items-center gap-2'>
          <div>
            <Icons.user />
          </div>
          <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
            {result[0]?.from_address}
          </p>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='pl-3'>Transaction</TableHead>
            <TableHead className='pl-3'>Result</TableHead>
            <TableHead className='pr-3 text-right'>Amount</TableHead>
            <TableHead className='pl-3'>Time</TableHead>
            <TableHead className='pl-3'>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.map((i, index) => (
            <TableRow key={index}>
              <TableCell className='pl-3'>
                <div className='flex flex-col'>
                  <ActionTypeCard
                    type={i.transaction_type}
                    className='text-base font-semibold'
                    classNameText='order-2'
                    classNameIcon='order-1 w-4 h-4'
                  />
                  <p className='text-sm font-medium italic capitalize'>{i.action_name}</p>
                </div>
              </TableCell>
              <TableCell className='pl-3'>
                <a href={i.transaction_on_explorer} target='_blank' rel='noreferrer noopener'>
                  {i.transaction_hash.slice(0, 7) +
                    '...' +
                    i.transaction_hash.slice(i.transaction_hash.length - 5)}
                </a>
              </TableCell>
              <TableCell className='pr-3 text-right'>
                <div className='flex items-center justify-end gap-2'>
                  <Image src={i.token_icon} width={20} height={20} alt={i.token_symbol} />
                  <p>
                    {i.token_symbol} {i.amount}
                  </p>
                </div>
              </TableCell>
              <TableCell className='pl-3'>
                {moment(i.timestamp).format('DD.MM.YY,')}
                <br />
                {moment(i.timestamp).format('HH:mm')}
              </TableCell>
              <TableCell className='pl-3'>
                <div className='flex w-fit items-center gap-1 rounded-[32px] border border-[#00E878] bg-[rgba(0,232,120,0.10)] px-3 py-[2px]'>
                  <p className='text-base font-semibold text-[#00E878]'>Done</p>
                  <div>
                    <Icons.status_done />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
          <TableRow />
        </TableBody>
      </Table>
    </div>
  );
};
