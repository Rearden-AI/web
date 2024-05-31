import Image from 'next/image';

import { Networks } from '../../../lib/networks';
import { Action, ActionType } from '../../../types/chat';
import { ActionTypeCard } from '../../action-type-card';
import { Icons } from '@rearden/ui/components/icons';
import { TokenInfo } from './token-info';

export const ActionDetailCard = ({ action }: { action: Action }) => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-md border border-border-secondary bg-card-secondary p-4'>
      <ActionTypeCard type={action.action_type} />
      <div className='grid grid-cols-2 gap-x-1 gap-y-3'>
        {action.details.dapp_link && (
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>dApp</p>
            <div className='group flex items-center gap-[2px]'>
              <a
                href={action.details.dapp_link}
                target='_blank'
                rel='noreferrer noopener'
                className='w-fit break-all bg-primary-gradient bg-clip-text text-base font-semibold text-transparent group-hover:opacity-50'
              >
                {action.details.dapp_link}
              </a>
              <div>
                <Icons.link className='group-hover:opacity-50' />
              </div>
            </div>
          </div>
        )}
        {action.details.network && (
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>Smart contract address</p>
            <div className='group flex items-center gap-[2px]'>
              <a
                href={
                  Networks[action.details.network]?.contractPathname
                    ? `${Networks[action.details.network]?.contractPathname}${action.body.contract_address}`
                    : `${Networks[action.details.network]!.explorer}/address/${action.body.contract_address}`
                }
                target='_blank'
                rel='noreferrer noopener'
                className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent group-hover:opacity-50'
              >
                Address
              </a>
              <div>
                <Icons.link className='group-hover:opacity-50' />
              </div>
            </div>
          </div>
        )}
        {action.details.from && <TokenInfo label='From' value={action.details.from} />}
        {action.details.to && (
          <>
            {action.action_type === ActionType.ADD_LIQUIDITY ? (
              <div className='flex flex-col'>
                <p className='text-sm font-bold'>To</p>
                <div className='flex items-center gap-1'>
                  {typeof action.details.from !== 'string' ? (
                    <div className='flex'>
                      {action.details.from?.map(i => {
                        return <Image key={i} src={`/${i}.png`} width={18} height={18} alt={i} />;
                      })}
                    </div>
                  ) : (
                    <></>
                  )}
                  <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
                    {action.details.to}
                  </p>
                </div>
              </div>
            ) : (
              <TokenInfo label='Receive' value={action.details.to} />
            )}
          </>
        )}
        {action.details.network && (
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>Network</p>
            <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
              {Networks[action.details.network]!.name}
            </p>
          </div>
        )}
        {action.details.apy && (
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>APY</p>
            <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
              {action.details.apy}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
