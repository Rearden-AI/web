import { Hex } from 'viem';
import { describe, expect, test } from 'vitest';
import { AbiFunction, ActionDataInput } from '../types/chat';
import { prepareParams } from './prepare-send-data';

describe('prepareParams()', () => {
  describe('amount type', () => {
    test('if value equal user_input than preparedValue equal 2000000', async () => {
      const obj = {
        id: 1,
        value_source: 'user_input',
        description: 'test',
        type: 'amount',
        decimals: 6,
        value: '2',
      } as ActionDataInput;
      const value = await prepareParams(obj, [obj], {});

      expect(value.preparedValue).toBe(2000000n);
    });
  });

  describe('type equal to deadline', () => {
    test('return now date plus 900000ms', async () => {
      const obj = {
        id: 1,
        value_source: 'deadline',
      } as ActionDataInput;
      const value = await prepareParams(obj, [obj], {});

      expect(value.preparedValue).toBe(Date.now() + 900000);
    });
  });

  describe('value method_result', () => {
    test('uniswap swap args', async () => {
      const obj = {
        id: 2,
        value_source: 'method_result',
        type: 'amount',
        to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        method_name: 'getAmountsIn',
        method_params: [
          {
            input_id: 0,
          },
          [
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          ],
        ],
        method_result: 0,
      } as ActionDataInput;

      const abi = {
        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
              },
              {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
              },
            ],
            name: 'getAmountsIn',
            outputs: [
              {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
      } as unknown as Record<Hex, AbiFunction[]>;

      const array = [
        {
          id: 0,
          value_source: 'user_input',
          description: 'Enter USDT amount',
          type: 'amount',
          decimals: 6,
          value: '2',
        },
        {
          id: 1,
          value_source: 'deadline',
        },
        {
          id: 2,
          value_source: 'method_result',
          type: 'amount',
          to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
          method_name: 'getAmountsIn',
          method_parameters: [
            {
              input_id: 0,
            },
            [
              '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
              '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            ],
          ],
          method_result: 0,
        },
      ] as ActionDataInput[];

      const value = await prepareParams(obj, array, abi);
      expect(value.preparedValue).toBeDefined();
    });
  });
});
