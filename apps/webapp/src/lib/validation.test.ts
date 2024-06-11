import { describe, expect, test } from 'vitest';
import { validateAmount } from './validation';
import BigNumber from 'bignumber.js';

describe('validateAmount()', () => {
  test('if the amount is greater than the balance, the result is true', () => {
    const amount = BigNumber(20);
    const balance = BigNumber(10);
    expect(validateAmount(amount, balance)).toBeTruthy();
  });

  test('if the balance is greater than the amount, the result is false', () => {
    const amount = BigNumber(10);
    const balance = BigNumber(20);
    expect(validateAmount(amount, balance)).toBeFalsy();
  });

  test('if the balance and amount are equal, the result is false', () => {
    const amount = BigNumber(20);
    const balance = BigNumber(20);
    expect(validateAmount(amount, balance)).toBeFalsy();
  });
});
