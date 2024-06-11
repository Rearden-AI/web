import BigNumber from 'bignumber.js';
import { describe, expect, test } from 'vitest';
import { toBaseUnitAmount } from './formatter';

describe('toBaseUnitAmount()', () => {
  test('zero value should return 0', () => {
    const zeroValue = '';
    expect(toBaseUnitAmount(zeroValue, 1).toNumber()).toBe(0);
  });

  test('value with zero exponent return same value', () => {
    const value = '1000';
    expect(toBaseUnitAmount(value, 0)).toStrictEqual(BigNumber(value));
  });

  test('value and exponent return value', () => {
    const value = '1000';
    expect(toBaseUnitAmount(value, 2)).toStrictEqual(BigNumber(100000));
  });

  test('big value and exponent return value', () => {
    const bigValue = '100000000000000';
    expect(toBaseUnitAmount(bigValue, 3)).toStrictEqual(BigNumber('100000000000000000'));
  });

  test('float value and exponent return value', () => {
    const floatValue = '100.234';
    expect(toBaseUnitAmount(floatValue, 1)).toStrictEqual(BigNumber(1002.34));
  });
});
