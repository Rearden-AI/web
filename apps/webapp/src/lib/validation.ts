import { GetBalanceReturnType } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { parseUnits } from 'viem';

export const validateAmount = (amount: string, balance: GetBalanceReturnType): boolean => {
  const amountValue = BigNumber(parseUnits(amount, balance.decimals).toString());
  const balanceValue = BigNumber(balance.value.toString());
  return Boolean(amount) && amountValue.isGreaterThan(balanceValue);
};
