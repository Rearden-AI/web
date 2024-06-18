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
import {
  Action,
  ActionDataUserInput,
  UserInput,
  UserInputObject,
  UserInputValueType,
  ValueSource,
} from '../../../types/chat';
import { ActionDetailCard } from './action-detail-card';
import { ModalLoader } from './modal-loader';
import axiosInstance from '../../../config/axios';
import { API_ID, ApiRoutes } from '../../../constants/api-routes';
import { useParams } from 'next/navigation';
import { mapInputValues } from '../../../lib/map-input-values';

interface TransactionCardProps {
  index: number;
  action: Action;
  actionValues: UserInputObject;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setResult: Dispatch<SetStateAction<number[]>>;
  setActionValues: Dispatch<SetStateAction<UserInputObject>>;
}

export const TransactionForm = ({
  index,
  action,
  actionValues,
  setResult,
  setCurrentStep,
  setActionValues,
}: TransactionCardProps) => {
  const { switchChainAsync } = useSwitchChain();
  const { address } = useAccount();
  const params = useParams<{ id?: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<GetBalanceReturnType>();
  const [inputs, setInputs] = useState<ActionDataUserInput[]>([]);

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
    setInputs(mapInputValues(action.action_data.transaction_data.inputs, actionValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveToGenerate = () => {
    void (async () => {
      if (!address || !balance) return;

      await switchChainAsync({ chainId: action.action_data.network.chain.chainId });

      try {
        setLoading(true);

        const preparedParams = await Promise.all(
          inputs.map(
            async (i, _, array) =>
              await prepareParams(i, array, action.action_data.transaction_data.abis),
          ),
        );

        const sendParams = getSendParams(action.action_data.transaction_data, preparedParams);

        const { data } = await axiosInstance.post<{ id: number }>(
          ApiRoutes.TRANSACTIONS,
          {
            amount: (
              inputs.find(
                i =>
                  i.value_source === ValueSource.USER_INPUT &&
                  i.type === UserInputValueType.AMOUNT &&
                  i.value,
              ) as UserInput
            ).value,
            token_symbol: balance.symbol,
            transaction_type: action.action_data.type,
            status: 'pending',
            to_address: '0x9a868D58C7F31DAd95626e9632A937Fff69a4F0e',
            from_address: address,
            chat_uuid: params.id,
            action_name: action.action_data.transaction_data.method_name ?? 'Transfer',
            network: action.action_data.network.name,
            timestamp: Date.now(),
          },
          { withCredentials: true },
        );

        const transactionHash = await sendTransaction(wagmiConfig, sendParams);

        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          chainId: action.action_data.network.chain.chainId,
          hash: transactionHash,
        });

        if (receipt.status === 'success') {
          await axiosInstance.patch(
            ApiRoutes.TRANSACTIONS_BY_ID.replace(API_ID, data.id.toString()),
            { transaction_hash: receipt.transactionHash, status: 'succeeded' },
            { withCredentials: true },
          );

          //Write user inputted values for next actions
          inputs.map(i => {
            setActionValues(state => ({
              ...state,
              [action.id]: {
                ...state[action.id],
                [i.id]: { ...i } as UserInput,
              },
            }));
          });

          setResult(state => [...state, data.id]);

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

      {inputs.map((i, index, array) => {
        if (i.value_source === ValueSource.USER_INPUT)
          return (
            <InputElement
              key={index}
              label={i.description}
              placeholder={i.description}
              type={i.type === UserInputValueType.AMOUNT ? 'number' : 'text'}
              value={i.value}
              onChange={e => {
                const updatedValue = array.map((j, ind) =>
                  index === ind ? { ...j, value: e.target.value } : j,
                );

                setInputs(updatedValue);
              }}
            />
          );
        return null;
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
