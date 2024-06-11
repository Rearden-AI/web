import BigNumber from 'bignumber.js';

export const validateAmount = (amount: BigNumber, balance: BigNumber): boolean => {
  return Boolean(amount) && amount.isGreaterThan(balance);
};
