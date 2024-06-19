import { Validation } from '@rearden/ui/components/input';
import { GetBalanceReturnType } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { isAddress, parseUnits } from 'viem';
import { UserInputValueType } from '../types/chat';

export const validateAmount = (amount: string, balance: GetBalanceReturnType): boolean => {
  const amountValue = BigNumber(parseUnits(amount, balance.decimals).toString());
  const balanceValue = BigNumber(balance.value.toString());
  return Boolean(amount) && amountValue.isGreaterThan(balanceValue);
};

export const inputsValidation = (
  value: string,
  type: UserInputValueType,
  balance?: GetBalanceReturnType,
) => {
  let validations: Validation[];

  if (type === UserInputValueType.AMOUNT) {
    validations = [
      {
        type: 'error',
        issue: 'insufficient funds',
        checkFn: (amount: string) => Boolean(balance) && validateAmount(amount, balance!),
      },
    ];
  } else {
    validations = [
      {
        type: 'error',
        issue: 'is not valid address',
        checkFn: (value: string) => Boolean(value) && !isAddress(value),
      },
    ];
  }

  const results = validations.filter(v => v.checkFn(value));
  const error = results.find(v => v.type === 'error');

  return error ? error : results.find(v => v.type === 'warn');
};
