import { Button } from '@rearden/ui/components/ui/button';
import { type GetBalanceReturnType } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import useDebounce from '../../../hooks/debounce';
import { useValidationResult } from '../../../hooks/validation-result';
import { toBaseUnitAmount } from '../../../lib/formatter';
import { validateAmount } from '../../../lib/validation';
import { Action } from '../../../types/chat';
import { BorderWrapper } from '../../border-wrapper';
import { InputElement } from '../../input';
import { ActionDetailCard } from './action-detail-card';
import { ModalLoader } from './modal-loader';
import { useStore } from '../../../state';
import { accountsSelector } from '../../../state/accounts';
import { d, Percentage, adjustForSlippage } from '@cetusprotocol/cetus-sui-clmm-sdk';
import { SUI_CLIENT } from '../../../lib/sui-client';
import BN from 'bn.js';
import { authService } from '../../../lib/auth-service';
import { suiService } from '../../../lib/sui-service';
import { SDK } from '../../../lib/cetum-sdk';
import useAxiosAuth from '../../../hooks/axios-auth';
import { API_ID, ApiRoutes } from '../../../lib/api-routes';
import { useParams } from 'next/navigation';

interface TransactionFormSuiProps {
  index: number;
  action: Action;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setResult: Dispatch<SetStateAction<number[]>>;
}

export const TransactionFormSui = ({
  index,
  action,
  setResult,
  setCurrentStep,
}: TransactionFormSuiProps) => {
  const { selectedAccount: address } = useStore(accountsSelector);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<GetBalanceReturnType>();
  const axiosInstance = useAxiosAuth();
  const params = useParams<{ id?: string }>();

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
      const balance = (await suiService.getBalance({
        owner: address,
        coinType: action.details.token_address_in ?? undefined,
      })) as GetBalanceReturnType;

      setBalance(balance);
    })();
  }, [address, action]);

  const approveToGenerate = () => {
    void (async () => {
      if (!address || !balance) return;

      // https://cetus-1.gitbook.io/cetus-developer-docs/developer/via-sdk/features-available/swap
      try {
        setLoading(true);
        const decimals = balance.decimals;

        const poolAddress = action.body.pool_address!;

        SDK.senderAddress = address;

        const pool = await SDK.Pool.getPool(poolAddress);
        // Whether the swap direction is token a to token b
        const a2b = false;
        // fix input token amount
        const coinAmount = parseUnits(amount, decimals).toString();
        // input token amount is token a
        const byAmountIn = true;
        // slippage value
        const slippage = Percentage.fromDecimal(d(5));
        // Fetch pool data

        const timestamp = Date.now();
        const { data } = await axiosInstance.post<{ id: number }>(ApiRoutes.TRANSACTIONS, {
          amount: amount,
          token_symbol: balance.symbol,
          transaction_type: action.action_type,
          status: 'pending',
          to_address: poolAddress,
          from_address: address,
          chat_uuid: params.id,
          action_name: action.details.name,
          // TODO need post with number
          network: action.details.network?.toString(),
          timestamp,
        });

        // Estimated amountIn amountOut fee
        const res = await SDK.Swap.preswap({
          pool,
          currentSqrtPrice: pool.current_sqrt_price,
          coinTypeA: pool.coinTypeA,
          coinTypeB: pool.coinTypeB,
          decimalsA: (await suiService.getDecimals(pool.coinTypeA)) ?? 0,
          decimalsB: (await suiService.getDecimals(pool.coinTypeB)) ?? 0,
          a2b,
          byAmountIn,
          amount: coinAmount,
        });

        if (!res) return;

        const toAmount = res.estimatedAmountOut as unknown as string;

        const amountLimit = adjustForSlippage(new BN(toAmount), slippage, !byAmountIn);

        // build swap Payload
        const swapPayload = await SDK.Swap.createSwapTransactionPayload({
          pool_id: pool.poolAddress,
          coinTypeA: pool.coinTypeA,
          coinTypeB: pool.coinTypeB,
          a2b,
          by_amount_in: byAmountIn,
          amount: res.amount.toString(),
          amount_limit: amountLimit.toString(),
        });

        const keypair = authService.getEd25519Keypair();

        const { bytes, signature: userSignature } = await swapPayload.sign({
          client: SUI_CLIENT,
          signer: keypair,
        });

        const zkLoginSignature = await authService.generateZkLoginSignature(userSignature);

        const receipt = await SUI_CLIENT.executeTransactionBlock({
          transactionBlock: bytes,
          signature: zkLoginSignature,
        });

        await axiosInstance.patch(
          ApiRoutes.TRANSACTIONS_BY_ID.replace(API_ID, data.id.toString()),
          {
            status: 'succeeded',
            transaction_hash: receipt.digest,
          },
        );

        setResult(state => [...state, data.id]);

        setCurrentStep(state => state + 1);
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
