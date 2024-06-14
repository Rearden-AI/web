import { Icons } from '@rearden/ui/components/icons';
import { ActionData } from '../../../types/chat';
import { ActionTypeCard } from '../../action-type-card';
import { ParamCard } from './param-card';

export const ActionDetailCard = ({ action }: { action: ActionData }) => {
  return (
    <div className='flex w-full flex-col gap-4 rounded-md border border-border-secondary bg-card-secondary p-4'>
      <ActionTypeCard type={action.type} />
      <div className='grid grid-cols-2 gap-x-1 gap-y-3'>
        {action.application_data?.url && action.application_data.name && (
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>dApp</p>

            <div className='group flex items-center gap-[2px]'>
              <a
                href={action.application_data.url}
                target='_blank'
                rel='noreferrer noopener'
                className='w-fit break-all bg-primary-gradient bg-clip-text text-base font-semibold text-transparent group-hover:opacity-50'
              >
                {action.application_data.name}
              </a>
              <div>
                <Icons.link className='group-hover:opacity-50' />
              </div>
            </div>
          </div>
        )}
        {action.application_data?.contract_address_on_explorer && (
          <div className='flex flex-col'>
            <p className='text-sm font-bold'>Smart contract address</p>
            <div className='group flex items-center gap-[2px]'>
              <a
                href={action.application_data.contract_address_on_explorer}
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
        {action.parameters_description.map(i => (
          <ParamCard params={i} key={i.name} />
        ))}
        <div className='flex flex-col'>
          <p className='text-sm font-bold'>Network</p>
          <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
            {action.network.name}
          </p>
        </div>
      </div>
    </div>
  );
};
