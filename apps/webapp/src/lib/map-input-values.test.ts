import { describe, expect, test } from 'vitest';
import { mapInputValues } from './map-input-values';
import { ActionResult, UserInput, UserInputObject, ValueSource } from '../types/chat';

describe('mapInputValues()', () => {
  test('input value is 10 should return 10', () => {
    const inputs = [
      {
        decimals: 18,
        description: 'Enter ETH amount to send',
        id: 1,
        type: 'amount',
        value: 10,
        value_source: 'user_input',
      },
    ] as unknown as UserInput[];

    expect((mapInputValues(inputs, {})[0] as UserInput).value).toBe('10');
  });

  test('if input value is not set should return ""', () => {
    const inputs = [
      {
        decimals: 18,
        description: 'Enter ETH amount to send',
        id: 1,
        type: 'amount',

        value_source: 'user_input',
      },
    ] as unknown as UserInput[];

    expect((mapInputValues(inputs, {})[0] as UserInput).value).toBe('');
  });

  test('value_source as action_result should get data from returns values', () => {
    const inputs = [
      {
        id: 0,
        value_source: 'action_result',
        description: 'Enter stETH amount to approve',
        action_id: 0,
        return_id: 0,
      },
    ] as unknown as ActionResult[];

    const returns = {
      '0': {
        '0': {
          id: 0,
          value_source: 'user_input',
          description: 'Enter ETH amount to stake',
          type: 'amount',
          decimals: 18,
          value: '0.00001',
        },
      },
    } as UserInputObject;

    const mappedValue = mapInputValues(inputs, returns)[0] as UserInput;

    expect(mappedValue.id).toBe(0);
    expect(mappedValue.value_source).toBe(ValueSource.USER_INPUT);
    expect(mappedValue.description).toBe('Enter stETH amount to approve');
    expect(mappedValue.type).toBe('amount');
    expect(mappedValue.decimals).toBe(18);
    expect(mappedValue.value).toBe('0.00001');
  });
});
