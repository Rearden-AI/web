import { describe, expect, test } from 'vitest';
import { inputsValidation, validateAmount } from './validation';
import { UserInputValueType } from '../types/chat';

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

  describe('inputsValidation()', () => {
    describe('validate amount', () => {
      const balance = {
        decimals: 18,
        formatted: '1',
        symbol: 'ETH',
        value: 1000000000000000000n,
      };

      const type = UserInputValueType.AMOUNT;

      test('return undefined if user input less value as balance', () => {
        const value = '0.1';
        expect(inputsValidation(value, type, balance)).toBeUndefined();
      });

      test('return undefined if user input equal value as balance', () => {
        const value = '1';
        expect(inputsValidation(value, type, balance)).toBeUndefined();
      });

      test('return error if user input bigger value as balance', () => {
        const value = '10';
        expect(inputsValidation(value, type, balance)?.type).toBe('error');
        expect(inputsValidation(value, type, balance)?.issue).toBe('insufficient funds');
      });
    });

    describe('validate address', () => {
      const type = UserInputValueType.ADDRESS;

      test('return undefined if user input valid address', () => {
        const value = '0x9a868D58C7F31DAd95626e9632A937Fff69a4F0e';
        expect(inputsValidation(value, type)).toBeUndefined();
      });

      test('return error if user input invalid address', () => {
        const value = '0x9a868D58C7F31DAd95616e9632A937Fff69a4F0e';
        expect(inputsValidation(value, type)?.type).toBe('error');
        expect(inputsValidation(value, type)?.issue).toBe('is not valid address');
      });

      test('return error if user input text', () => {
        const value = 'test-1';
        expect(inputsValidation(value, type)?.type).toBe('error');
        expect(inputsValidation(value, type)?.issue).toBe('is not valid address');
      });
    });
  });
});
