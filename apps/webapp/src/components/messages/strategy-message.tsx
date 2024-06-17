import { Action } from '../../types/chat';
import { SelectAccount } from './select-account';
import { StrategyAction } from './strategy-action';

export const StrategyMessage = ({ actions }: { actions: Action[] }) => {
  return (
    <div className='flex flex-col gap-6'>
      <p className='text-lg font-medium leading-[26px]'>
        You can interact with smart contracts from this chat interface directly. Please choose a
        wallet you want to supply with (or add new one).
      </p>
      <div className='flex flex-col gap-4'>
        {actions.map((i, index) => {
          return <StrategyAction action={i.action_data} key={index} index={index} />;
        })}
      </div>
      {/* <p className='text-lg font-medium leading-[26px]'>
        Please choose a wallet you want to supply with (or add new one).
      </p> */}
      <SelectAccount actions={actions} />
    </div>
  );
};
