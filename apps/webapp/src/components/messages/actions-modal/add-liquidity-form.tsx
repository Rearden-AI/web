// import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
// import { InputElement } from '@rearden/ui/components/input';
// import { Button } from '@rearden/ui/components/ui/button';
// import {
//   GetBalanceReturnType,
//   getBalance,
//   waitForTransactionReceipt,
//   writeContract,
// } from '@wagmi/core';
// import BigNumber from 'bignumber.js';
// import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// import { Abi, formatUnits } from 'viem';
// import { useAccount, useSwitchChain } from 'wagmi';
// import { wagmiConfig } from '../../../config/wagmi';
// import useDebounce from '../../../hooks/debounce';
// import { useValidationResult } from '../../../hooks/validation-result';
// import { toBaseUnitAmount } from '../../../lib/formatter';
// import { prepareAddLiquidity } from '../../../lib/prepare-transaction-args';
// import { validateAmount } from '../../../lib/validation';
// import { Action } from '../../../types/chat';
// import { ActionDetailCard } from './action-detail-card';
// import { ModalLoader } from './modal-loader';

// export const prepareAddLiquidity = ({
//   tokenA,
//   tokenB,
// }: {
//   tokenA: {
//     amount: string;
//     decimals: number;
//   };
//   tokenB: {
//     amount: string;
//     decimals: number;
//   };
// }): ContractFunctionArgs => {
//   //https://docs.mav.xyz/v1-technical-reference/v1-contracts/router#fn-addliquiditytopool
//   return [
//     '0xb59b25d60f0ef9102ee6435cf0f7be8f23b1c6d2',
//     BigInt(0), //NFT ID of the token uint256 that will hold LP balance. Use 0 to mint a new token
//     [
//       {
//         kind: 3, //BOTH
//         isDelta: true,
//         pos: 0,
//         deltaA: parseUnits(tokenA.amount, tokenA.decimals),
//         deltaB: parseUnits(tokenB.amount, tokenB.decimals),
//       },
//     ],
//     BigInt(0),
//     BigInt(0),
//     BigInt(1e13),
//   ];
// };

// interface AddLiquidityFormProps {
//   index: number;
//   action: Action;
//   setCurrentStep: Dispatch<SetStateAction<number>>;
//   setResult: Dispatch<SetStateAction<number[]>>;
// }

// export const AddLiquidityForm = ({ index, action, setCurrentStep }: AddLiquidityFormProps) => {
//   const { switchChainAsync } = useSwitchChain();
//   const { address } = useAccount();
//   const [amounts, setAmounts] = useState<{ tokenA: string; tokenB: string }>({
//     tokenA: '',
//     tokenB: '',
//   });

//   const [loading, setLoading] = useState<boolean>(false);
//   const [balances, setBalances] = useState<{
//     tokenA?: GetBalanceReturnType;
//     tokenB?: GetBalanceReturnType;
//   }>({});

//   const debounceTokenA = useDebounce(amounts.tokenA);
//   const debounceTokenB = useDebounce(amounts.tokenB);

//   const validationTokenA = useValidationResult(
//     [
//       {
//         type: 'error',
//         issue: 'insufficient funds',
//         checkFn: (amount: string) =>
//           validateAmount(
//             toBaseUnitAmount(amount, balances.tokenA?.decimals ?? 1),
//             balances.tokenA ? BigNumber(balances.tokenA.value.toString()) : BigNumber(0),
//           ),
//       },
//     ],
//     debounceTokenA,
//   );

//   const validationTokenB = useValidationResult(
//     [
//       {
//         type: 'error',
//         issue: 'insufficient funds',
//         checkFn: (amount: string) =>
//           validateAmount(
//             toBaseUnitAmount(amount, balances.tokenB?.decimals ?? 1),
//             balances.tokenB ? BigNumber(balances.tokenB.value.toString()) : BigNumber(0),
//           ),
//       },
//     ],
//     debounceTokenB,
//   );

//   useEffect(() => {
//     if (!address) return;
//     void (async () => {
//       const [tokenA, tokenB] = await Promise.all(
//         [action.details.token_address_in, action.details.token_address_out].map(async i => {
//           return await getBalance(wagmiConfig, {
//             address,
//             token: i ?? undefined,
//             chainId: action.details.network,
//           });
//         }),
//       );

//       setBalances({
//         tokenA,
//         tokenB,
//       });
//     })();
//   }, [address, action]);

//   const approveToGenerate = () => {
//     void (async () => {
//       if (!address || !balances.tokenA || !balances.tokenB || !action.details.network) return;

//       await switchChainAsync({ chainId: action.details.network });

//       try {
//         setLoading(true);

//         const abi: Abi = [action.body.abi];
//         const transactionHash = await writeContract(wagmiConfig, {
//           abi,
//           address: '0x39E098A153Ad69834a9Dac32f0FCa92066aD03f4',
//           functionName: action.body.abi.name,
//           args: prepareAddLiquidity({
//             tokenA: { amount: debounceTokenA, decimals: balances.tokenA.decimals },
//             tokenB: { amount: debounceTokenB, decimals: balances.tokenB.decimals },
//           }),
//         });

//         const receipt = await waitForTransactionReceipt(wagmiConfig, {
//           chainId: action.details.network,
//           hash: transactionHash,
//         });

//         if (receipt.status === 'success') {
//           setCurrentStep(state => state + 1);
//         }
//       } catch (error) {
//       }
//       setLoading(false);
//       setAmounts({
//         tokenA: '',
//         tokenB: '',
//       });
//     })();
//   };

//   if (loading) return <ModalLoader />;

//   const updateDependentToken = (inputedToken: 'tokenA' | 'tokenB', value: string) => {
//     const ratio = 0.38865;

//     if (inputedToken === 'tokenA') {
//       setAmounts({
//         tokenA: value,
//         tokenB: (Number(value) * ratio).toFixed(balances.tokenB?.decimals),
//       });
//     } else {
//       setAmounts({
//         tokenB: value,
//         tokenA: (Number(value) / ratio).toFixed(balances.tokenA?.decimals),
//       });
//     }
//   };

//   return (
//     <div className='flex flex-col items-center gap-4'>
//       <div className='flex w-full items-center gap-3'>
//         <BorderWrapper
//           className='rounded-[7px] bg-card-secondary px-3 py-1'
//           wrapperClassName='p-[0.7px] rounded-[7px] flex-0'
//         >
//           <p className='w-fit bg-primary-gradient bg-clip-text text-base font-bold text-transparent'>
//             {index}
//           </p>
//         </BorderWrapper>
//         <p className='w-fit bg-primary-gradient bg-clip-text text-lg font-bold leading-[26px] text-transparent'>
//           {action.details.name}
//         </p>
//       </div>
//       <ActionDetailCard action={action} />
//       <InputElement
//         placeholder='0.00'
//         type='number'
//         value={amounts.tokenA}
//         onChange={e => updateDependentToken('tokenA', e.target.value)}
//         label={`${balances.tokenA ? balances.tokenA.symbol : ''} amount`}
//         balance={{
//           symbol: balances.tokenA ? balances.tokenA.symbol : '',
//           displayValue: balances.tokenA
//             ? formatUnits(balances.tokenA.value, balances.tokenA.decimals)
//             : '0.00',
//         }}
//         validationResult={validationTokenA}
//       />

//       <InputElement
//         placeholder='0.00'
//         type='number'
//         value={amounts.tokenB}
//         onChange={e => updateDependentToken('tokenB', e.target.value)}
//         balance={{
//           symbol: balances.tokenB ? balances.tokenB.symbol : '',
//           displayValue: balances.tokenB
//             ? formatUnits(balances.tokenB.value, balances.tokenB.decimals)
//             : '0.00',
//         }}
//         validationResult={validationTokenB}
//       />

//       <Button
//         className='mt-4 w-[91px]'
//         onClick={approveToGenerate}
//         disabled={
//           !Number(debounceTokenA) ||
//           !Number(debounceTokenB) ||
//           Boolean(validationTokenA) ||
//           Boolean(validationTokenB)
//         }
//       >
//         Proceed
//       </Button>
//     </div>
//   );
// };
