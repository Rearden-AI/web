import { Hex } from 'viem';
import { describe, expect, test } from 'vitest';
import { AbiFunction, ActionDataUserInput, TransactionData, ValueSource } from '../types/chat';
import { getContractAbi, getSendParams, prepareParams } from './prepare-send-data';

describe('prepare send data', () => {
  describe('prepareParams()', () => {
    test('prepareParams for send ETH', async () => {
      const inputs = [
        {
          id: 0,
          value_source: ValueSource.USER_INPUT,
          value: '0x9a868D58C7F21DAd9562ge9638A957Fff69a4a0e',
          description: 'Enter receiver address',
          type: 'address',
        },
        {
          id: 1,
          value_source: ValueSource.USER_INPUT,
          value: '1',
          description: 'Enter ETH amount to send',
          type: 'amount',
          decimals: 18,
        },
      ] as ActionDataUserInput[];

      const address = await prepareParams(inputs[0]!, inputs);
      const amount = await prepareParams(inputs[1]!, inputs);

      expect(address.value).toBe('0x9a868D58C7F21DAd9562ge9638A957Fff69a4a0e');
      expect(amount.value).toBe(1000000000000000000n);
    });

    describe('amount type', () => {
      test('if value equal user_input than value equal 2000000', async () => {
        const obj = {
          id: 1,
          value_source: ValueSource.USER_INPUT,
          description: 'test',
          type: 'amount',
          decimals: 6,
          value: '2',
        } as ActionDataUserInput;

        const params = await prepareParams(obj, [obj], {});

        expect(params.value).toBe(2000000n);
      });
    });

    describe('type equal to deadline', () => {
      test('return now date plus 900000ms', async () => {
        const obj = {
          id: 1,
          value_source: ValueSource.DEADLINE,
        } as ActionDataUserInput;

        const params = await prepareParams(obj, [obj], {});

        expect(params.value).toBe(Date.now() + 900000);
      });
    });

    describe('value method_result', () => {
      test('uniswap swap args', async () => {
        const obj = {
          id: 2,
          value_source: ValueSource.METHOD_RESULT,
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
        } as ActionDataUserInput;

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
            value_source: ValueSource.USER_INPUT,
            description: 'Enter USDT amount',
            type: 'amount',
            decimals: 6,
            value: '2',
          },
          {
            id: 1,
            value_source: ValueSource.DEADLINE,
          },
          {
            id: 2,
            value_source: ValueSource.METHOD_RESULT,
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
        ] as ActionDataUserInput[];

        const params = await prepareParams(obj, array, abi);
        expect(params.value).toBeDefined();
      });
    });
  });

  describe('getContractAbi()', () => {
    const address = '0x9a868D58C7F21DAd9562ge9638A957Fff69a4a0e';

    const contractAbi = [
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'pure',
        type: 'function',
      },
    ];
    test('return abi if abi as object', () => {
      const abis = {
        '0x9a868D58C7F21DAd9562ge9638A957Fff69a4a0e': contractAbi,
      } as Record<Hex, AbiFunction[] | string>;

      const abi = getContractAbi(address, abis);
      expect(abi).toStrictEqual(contractAbi);
    });

    test('return abi if abi as string', () => {
      const abis = {
        '0x9a868D58C7F21DAd9562ge9638A957Fff69a4a0e': JSON.stringify(contractAbi),
      } as Record<Hex, AbiFunction[] | string>;

      const abi = getContractAbi(address, abis);
      expect(abi).toStrictEqual(contractAbi);
    });

    test('return undefined if abis are not set', () => {
      const abi = getContractAbi(address, undefined);
      expect(abi).toBeUndefined();
    });

    test('return undefined if abis are not set for current address', () => {
      const address = '0x9a868D58C7F21DAd9562ge9638A957Fff69a4a0e';

      const abis = {
        '0x9a868D58C7F21DAd9562ge9638A957Fff69a4a0z': JSON.stringify(contractAbi),
      } as Record<Hex, AbiFunction[] | string>;
      const abi = getContractAbi(address, abis);
      expect(abi).toBeUndefined();
    });
  });

  describe('getSendParams()', () => {
    describe('send native token', () => {
      const transactionData = {
        to: { input_id: 0 },
        value: { input_id: 1 },
        inputs: [
          {
            id: 0,
            value_source: ValueSource.USER_INPUT,
            value: null,
            description: 'Enter receiver address',
            type: 'address',
          },
          {
            id: 1,
            value_source: ValueSource.USER_INPUT,
            value: null,
            description: 'Enter ETH amount to send',
            type: 'amount',
            decimals: 18,
          },
        ],
      } as unknown as TransactionData;

      test('send ETH data field should be undefined', () => {
        const address = '0x1a868D58C7F31DAd85626e9632A937Fff69a4F0a';
        const amount = 100000000000000n;

        const preparedParams = [
          {
            id: 0,
            value: address,
          },
          {
            id: 1,
            value: amount,
          },
        ];

        const params = getSendParams(transactionData, preparedParams);
        expect(params).toStrictEqual({
          to: address,
          value: amount,
          data: undefined,
        });
      });

      test('send ETH prepared amount as string should return bigint', () => {
        const address = '0x1a868D58C7F31DAd85626e9632A937Fff69a4F0a';
        const amount = '100000000000000';

        const preparedParams = [
          {
            id: 0,
            value: address,
          },
          {
            id: 1,
            value: amount,
          },
        ];

        const params = getSendParams(transactionData, preparedParams);

        expect(params).toStrictEqual({
          to: address,
          value: BigInt(amount),
          data: undefined,
        });
      });
    });

    describe('send USDC token', () => {
      const contract = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      const transactionData = {
        to: contract,
        method_name: 'transfer',
        method_params: [{ input_id: 0 }, { input_id: 1 }],
        abis: {
          [contract]: [
            {
              constant: false,
              inputs: [
                { name: '_to', type: 'address' },
                { name: '_value', type: 'uint256' },
              ],
              name: 'transfer',
              outputs: [{ name: '', type: 'bool' }],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        },
        inputs: [
          {
            id: 0,
            value_source: 'user_input',
            value: null,
            description: 'Enter receiver address',
            type: 'address',
          },
          {
            id: 1,
            value_source: 'user_input',
            value: null,
            description: 'Enter USDC amount to send',
            type: 'amount',
            decimals: 6,
          },
        ],
      } as unknown as TransactionData;

      test('send USDC data field should be defined', () => {
        const address = '0x940b68AE6a76Ef1A1f1a617789CffC8B1cf9c6c3';
        const amount = 1000000n;

        const preparedParams = [
          {
            id: 0,
            value: address,
          },
          {
            id: 1,
            value: amount,
          },
        ];

        const params = getSendParams(transactionData, preparedParams);

        expect(params).toStrictEqual({
          to: contract,
          value: undefined,
          data: '0xa9059cbb000000000000000000000000940b68ae6a76ef1a1f1a617789cffc8b1cf9c6c300000000000000000000000000000000000000000000000000000000000f4240',
        });
      });
    });
  });
});
