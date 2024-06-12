import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { InputElement } from '@rearden/ui/components/input';
import { Button } from '@rearden/ui/components/ui/button';
import {
  getBalance,
  waitForTransactionReceipt,
  writeContract,
  type GetBalanceReturnType,
} from '@wagmi/core';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Abi } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { wagmiConfig } from '../../../config/wagmi';
import { ActionData, ActionDataInputWithValue } from '../../../types/chat';
import { ActionDetailCard } from './action-detail-card';
import { ModalLoader } from './modal-loader';
import { prepareArgs } from '../../../lib/prepare-args';
import { checkProperty } from '../../../lib/check-property';

interface TransactionCardProps {
  index: number;
  action: ActionData;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setResult: Dispatch<SetStateAction<number[]>>;
}

export const TransactionForm = ({ index, action, setCurrentStep }: TransactionCardProps) => {
  const { switchChainAsync } = useSwitchChain();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<GetBalanceReturnType>();
  const [values, setValues] = useState<ActionDataInputWithValue[]>([]);

  console.log(JSON.stringify(action));

  useEffect(() => {
    if (!address) return;
    void (async () => {
      const balance = await getBalance(wagmiConfig, {
        address,
        token: action.balance_data.coin === 'native' ? undefined : action.balance_data.coin,
        chainId: action.network.chain.chainId,
      });

      setBalance(balance);
    })();
  }, [address, action]);

  useEffect(() => {
    setValues(
      action.transaction_data.inputs.map(i => ({
        ...i,
        inputtedValue: i.value === 'user_input' ? '' : undefined,
      })),
    );
  }, [action.transaction_data.inputs]);

  const approveToGenerate = () => {
    void (async () => {
      if (!address || !balance) return;

      await switchChainAsync({ chainId: action.network.chain.chainId });

      try {
        setLoading(true);

        const dynamicParams = await Promise.all(
          values.map(
            async (i, _, array) => await prepareArgs(i, array, action.transaction_data.abis),
          ),
        );

        const functionParams = action.transaction_data.method_params.map(param => {
          if (checkProperty(param, 'input_id')) {
            const inputId = (param as { input_id: number }).input_id;
            return dynamicParams.find(i => i.id === inputId)?.preparedValue;
          }
          return param;
        });

        const abi = action.transaction_data.abis[action.transaction_data.to] as Abi;

        console.log({ abi, action });

        const paramValue = dynamicParams.find(i => i.id === action.transaction_data.value.input_id);

        console.log({ functionParams });

        functionParams[2] = '0x9a868D58C7F31DAd95626e9632A937Fff69a4F0e';
        const transactionHash = await writeContract(wagmiConfig, {
          abi,
          address: action.transaction_data.to,
          functionName: action.transaction_data.method_name,
          args: functionParams,
          value: paramValue ? (paramValue.preparedValue as bigint) : undefined,
        });

        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          chainId: action.network.chain.chainId,
          hash: transactionHash,
        });

        if (receipt.status === 'success') {
          setCurrentStep(state => state + 1);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
      // setAmount('');
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
          {action.description}
        </p>
      </div>
      <ActionDetailCard action={action} />
      {/* <InputElement
        placeholder='0.00'
        type='number'
        value={amount}
        onChange={e => {
          setAmount(e.target.value);
        }}
        label={`${balance?.symbol} amount`}
        balance={{
          symbol: balance?.symbol ?? '',
          displayValue: balance ? formatUnits(balance.value, balance.decimals) : '0.00',
        }}
        validationResult={validationResult}
      /> */}
      {values.map((i, index) => {
        if (i.value !== 'user_input') return null;

        return (
          <InputElement
            key={index}
            label={i.description}
            placeholder={i.description}
            type='number'
            value={i.inputtedValue}
            onChange={e => {
              const newArray = [...values];
              const currentObj = newArray[index]!;

              currentObj.inputtedValue = e.target.value;

              newArray[index] = currentObj;
              setValues(newArray);
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
