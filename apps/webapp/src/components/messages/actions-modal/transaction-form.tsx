import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { InputElement } from '@rearden/ui/components/input';
import { Button } from '@rearden/ui/components/ui/button';
import {
  getBalance,
  sendTransaction,
  waitForTransactionReceipt,
  type GetBalanceReturnType,
} from '@wagmi/core';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { wagmiConfig } from '../../../config/wagmi';
import { getSendParams, prepareParams } from '../../../lib/prepare-send-data';
import { Action, ActionDataInput } from '../../../types/chat';
import { ActionDetailCard } from './action-detail-card';
import { ModalLoader } from './modal-loader';
import { ObjectInObject } from '../../../types/generic';

interface TransactionCardProps {
  index: number;
  action: Action;
  returnValues: ObjectInObject;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setResult: Dispatch<SetStateAction<number[]>>;
  setReturnValues: Dispatch<SetStateAction<ObjectInObject>>;
}

export const TransactionForm = ({
  index,
  action,
  returnValues,
  setCurrentStep,
  setReturnValues,
}: TransactionCardProps) => {
  const { switchChainAsync } = useSwitchChain();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<GetBalanceReturnType>();
  const [values, setValues] = useState<ActionDataInput[]>([]);

  useEffect(() => {
    if (!address) return;
    void (async () => {
      const balance = await getBalance(wagmiConfig, {
        address,
        token:
          action.action_data.balance_data.coin === 'native'
            ? undefined
            : action.action_data.balance_data.coin,
        chainId: action.action_data.network.chain.chainId,
      });

      setBalance(balance);
    })();
  }, [address, action]);

  useEffect(() => {
    setValues(
      action.action_data.transaction_data.inputs.map(i => ({
        ...i,
        value: i.value_source === 'user_input' ? (i.value ? `${i.value}` : '') : undefined,
      })),
    );
  }, [action.action_data.transaction_data.inputs]);

  const approveToGenerate = () => {
    void (async () => {
      if (!address || !balance) return;

      await switchChainAsync({ chainId: action.action_data.network.chain.chainId });

      try {
        setLoading(true);

        const preparedParams = await Promise.all(
          values.map(
            async (i, _, array) =>
              await prepareParams(i, array, returnValues, action.action_data.transaction_data.abis),
          ),
        );

        const sendParams = getSendParams(action.action_data.transaction_data, preparedParams);

        const transactionHash = await sendTransaction(wagmiConfig, sendParams);

        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          chainId: action.action_data.network.chain.chainId,
          hash: transactionHash,
        });

        if (receipt.status === 'success') {
          setCurrentStep(state => state + 1);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  };

  if (loading) return <ModalLoader />;

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex w-full items-center gap-3'>
        <BorderWrapper
          className='rounded-[7px] bg-card-secondary px-3 py-1'
          wrapperClassName='p-[0.7px] rounded-[7px] flex-0'
        >
          <p className='w-fit bg-primary-gradient bg-clip-text text-base font-bold text-transparent'>
            {index}
          </p>
        </BorderWrapper>
        <p className='w-fit bg-primary-gradient bg-clip-text text-lg font-bold leading-[26px] text-transparent'>
          {action.action_data.description}
        </p>
      </div>
      <ActionDetailCard action={action.action_data} />

      {values.map((i, index, array) => {
        if (i.value_source !== 'user_input') return null;
        return (
          <InputElement
            key={index}
            label={i.description}
            placeholder={i.description}
            type={i.type === 'amount' ? 'number' : 'text'}
            value={i.value}
            onChange={e => {
              const updatedValue = array.map((j, ind) =>
                index === ind ? { ...j, value: e.target.value } : j,
              );

              setValues(updatedValue);
              if (action.action_data.transaction_data.returns?.length) {
                setReturnValues(state => ({ ...state, [action.id]: { [i.id]: e.target.value } }));
              }
            }}
          />
        );
      })}
      <Button
        className='mt-4 w-[91px]'
        onClick={approveToGenerate}
        // disabled={!Number(debounceAmount) || Boolean(validationResult)}
      >
        Proceed
      </Button>
    </div>
  );
};
