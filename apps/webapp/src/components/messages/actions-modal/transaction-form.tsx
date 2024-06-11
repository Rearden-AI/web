import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { InputElement } from '@rearden/ui/components/input';
import { Button } from '@rearden/ui/components/ui/button';
import {
  getBalance,
  sendTransaction,
  waitForTransactionReceipt,
  writeContract,
  type GetBalanceReturnType,
} from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Abi, ContractFunctionArgs, Hex, formatUnits, parseEther, parseUnits } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { wagmiConfig } from '../../../config/wagmi';
import useDebounce from '../../../hooks/debounce';
import { useValidationResult } from '../../../hooks/validation-result';
import { toBaseUnitAmount } from '../../../lib/formatter';
import { prepareDeposit, prepareSwap } from '../../../lib/prepare-transaction-args';
import { validateAmount } from '../../../lib/validation';
import { Action, ActionType } from '../../../types/chat';
import { ActionDetailCard } from './action-detail-card';
import { ModalLoader } from './modal-loader';

interface TransactionCardProps {
  index: number;
  action: Action;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setResult: Dispatch<SetStateAction<number[]>>;
}

export const TransactionForm = ({ index, action, setCurrentStep }: TransactionCardProps) => {
  const { switchChainAsync } = useSwitchChain();
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<GetBalanceReturnType>();

  const debounceAmount = useDebounce(amount);

  const validationResult = useValidationResult(
    [
      {
        type: 'error',
        issue: 'insufficient funds',
        checkFn: (amount: string) =>
          validateAmount(
            toBaseUnitAmount(amount, balance?.decimals ?? 1),
            balance ? BigNumber(balance.value.toString()) : BigNumber(0),
          ),
      },
    ],
    debounceAmount,
  );

  useEffect(() => {
    if (!address) return;
    void (async () => {
      const balance = await getBalance(wagmiConfig, {
        address,
        token: action.details.token_address_in ?? undefined,
        chainId: action.details.network,
      });

      setBalance(balance);
    })();
  }, [address, action]);

  const approveToGenerate = () => {
    void (async () => {
      if (!address || !balance || !action.details.network) return;

      await switchChainAsync({ chainId: action.details.network });

      try {
        setLoading(true);
        const decimals = balance.decimals;
        let transactionHash: Hex;

        if (action.action_type === ActionType.TRANSFER) {
          transactionHash = await sendTransaction(wagmiConfig, {
            chainId: action.details.network,
            to: address,
            value: parseEther(amount),
          });
        } else {
          const value =
            action.body.abi.stateMutability === 'payable'
              ? parseUnits(amount, decimals)
              : undefined;

          const abi: Abi = [action.body.abi];

          let params = {
            abi,
            address: action.body.contract_address,
            functionName: action.body.abi.name,
            value,
            args: [] as ContractFunctionArgs,
          };

          if (action.action_type === ActionType.SWAP) {
            params = {
              ...params,
              args: prepareSwap({ action, amount, decimals, userAddress: address }),
            };
          } else {
            params.args = prepareDeposit({
              action,
              amount,
              decimals,
            });
          }

          transactionHash = await writeContract(wagmiConfig, params);
        }

        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          chainId: action.details.network,
          hash: transactionHash,
        });

        if (receipt.status === 'success') {
          setCurrentStep(state => state + 1);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
      setAmount('');
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
          {action.details.name}
        </p>
      </div>
      <ActionDetailCard action={action} />
      <InputElement
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
      />
      <Button
        className='mt-4 w-[91px]'
        onClick={approveToGenerate}
        disabled={!Number(debounceAmount) || Boolean(validationResult)}
      >
        Proceed
      </Button>
    </div>
  );
};
