import { useEffect } from 'react';
import { Action, ActionType } from '../../types/chat';
import { SelectAccount } from './select-account';
import { StrategyAction } from './strategy-action';
import axios from 'axios';
import { CetusPriceResponse } from '../../types/cetus';
import { useStore } from '../../state';
import { pricesSelector } from '../../state/prices';

export const StrategyMessage = ({ strategies }: { strategies: Action[] }) => {
  const { setPrices } = useStore(pricesSelector);

  useEffect(() => {
    const getPrice = async () => {
      const { data } = await axios.get<CetusPriceResponse>(
        'https://api-sui.cetus.zone/v2/sui/price',
      );

      setPrices(data.data.prices);
    };

    void getPrice();
    const interval = setInterval(() => {
      void getPrice();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [setPrices]);

  return (
    <div className='flex flex-col gap-6'>
      <p className='text-lg font-medium leading-[26px]'>
        You can interact with smart contracts from this chat interface directly. Please choose a
        wallet you want to supply with (or add new one).
      </p>
      <div className='flex flex-col gap-4'>
        {strategies.map((i, index) => {
          return <StrategyAction action={i} key={index} index={index} />;
        })}
      </div>
      <></>
      <p className='text-lg font-medium leading-[26px]'>
        {strategies[0]?.action_type === ActionType.ZKLOGIN
          ? ''
          : 'Please choose a wallet you want to supply with (or add new one).'}
      </p>
      <SelectAccount strategies={strategies} />
    </div>
  );
};
