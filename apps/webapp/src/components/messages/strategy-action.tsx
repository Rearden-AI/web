import Image from 'next/image';

import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { Icons } from '@rearden/ui/components/icons';
import { Networks } from '../../constants/networks';
import { Action, ActionType } from '../../types/chat';
import { ActionTypeCard } from '../action-type-card';
import { TokenInfo } from './actions-modal/token-info';

interface StrategyActionProps {
  action: Action;
  index: number;
}

export const StrategyAction = ({ action, index }: StrategyActionProps) => {
  return (
    <div className='flex items-start gap-3 rounded-md border border-border-secondary bg-card-secondary py-5 pl-4 pr-6 shadow-3xl'>
      <BorderWrapper
        className='image-gradient-133deg rounded-[7px] px-3 py-1'
        wrapperClassName='p-[0.7px] rounded-[7px] flex-0'
      >
        <p className='w-fit bg-primary-gradient bg-clip-text text-base font-bold text-transparent'>
          {index + 1}
        </p>
      </BorderWrapper>
      <div className='flex w-full flex-col gap-2'>
        <div className='relative flex items-start justify-between'>
          <p className='w-fit bg-primary-gradient bg-clip-text text-lg font-bold leading-[26px] text-transparent'>
            {action.details.name}
          </p>
          {action.details.network && (
            <div className='absolute right-0 top-0 flex flex-col gap-1 rounded-sm bg-card px-3 py-1'>
              <p className='text-sm font-bold'>Network</p>
              <div className='flex items-center gap-1'>
                <Image
                  src={Networks[action.details.network]!.iconUrl}
                  width={18}
                  height={18}
                  alt={action.details.network.toString()}
                />
                <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
                  {Networks[action.details.network]!.name}
                </p>
              </div>
            </div>
          )}
        </div>
        <ActionTypeCard type={action.action_type} />
        <div className='mt-1 grid grid-cols-2 gap-y-3'>
          {action.details.dapp_link && (
            <div className='flex flex-col'>
              <p className='text-sm font-bold'>dApp</p>
              <div className='group flex items-center gap-[2px]'>
                <a
                  href={action.details.dapp_link}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent group-hover:opacity-50'
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
          {/* {action.details.to && (
            <TokenInfo label="To" value={action.details.to} />
          )} */}
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
    </div>
  );
};
