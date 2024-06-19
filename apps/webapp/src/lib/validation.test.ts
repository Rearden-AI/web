import { describe, expect, test } from 'vitest';
import { validateAmount } from './validation';

describe('validateAmount()', () => {
  test('if the amount is greater than the balance, the result is true', () => {
    const amount = '2';
    const balance = {
      decimals: 18,
      symbol: 'ETH',
      value: 1000000000000000000n,
      formatted: '1',
    };

    expect(validateAmount(amount, balance)).toBeTruthy();
  });

  test('if the balance is greater than the amount, the result is false', () => {
    const amount = '1';
    const balance = {
      decimals: 18,
      symbol: 'ETH',
      value: 2000000000000000000n,
      formatted: '2',
    };
    expect(validateAmount(amount, balance)).toBeFalsy();
  });

  test('if the balance and amount are equal, the result is false', () => {
    const amount = '2';
    const balance = {
      decimals: 18,
      symbol: 'ETH',
      value: 2000000000000000000n,
      formatted: '2',
    };
    expect(validateAmount(amount, balance)).toBeFalsy();
  });
});
