import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { Icons } from '@rearden/ui/components/icons';
import { ActionData } from '../../types/chat';
import { ActionTypeCard } from '../action-type-card';
import { ParamCard } from './actions-modal/param-card';
import Image from 'next/image';

interface StrategyActionProps {
  action: ActionData;
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
            {action.description}
          </p>

          <div className='absolute right-0 top-0 flex flex-col gap-1 rounded-sm bg-card px-3 py-1'>
            <p className='text-sm font-bold'>Network</p>
            <div className='flex items-center gap-1'>
              {action.network.icon && (
                <Image src={action.network.icon} width={18} height={18} alt={action.network.icon} />
              )}
              <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
                {action.network.name}
              </p>
            </div>
          </div>
        </div>
        <ActionTypeCard type={action.type} />
        <div className='mt-1 grid grid-cols-2 gap-y-3'>
          {action.application_data?.url && (
            <div className='flex flex-col'>
              <p className='text-sm font-bold'>dApp</p>
              <div className='group flex items-center gap-[2px]'>
                <a
                  href={action.application_data.url}
                  target='_blank'
                  rel='noreferrer noopener'
                  className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent group-hover:opacity-50'
                >
                  {action.application_data.name}
                </a>
                <div>
                  <Icons.link className='group-hover:opacity-50' />
                </div>
              </div>
            </div>
          )}
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>Smart contract address</p>
            <div className='group flex items-center gap-[2px]'>
              <a
                href={action.application_data?.contract_address_on_explorer}
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
          {action.parameters_description?.map(i => <ParamCard key={i.name} params={i} />)}
        </div>
      </div>
    </div>
  );
};
