import { readContract } from '@wagmi/core';
import { Hex, parseUnits } from 'viem';
import { wagmiConfig } from '../config/wagmi';
import { AbiFunction, ActionDataInputWithValue } from '../types/chat';
import { checkProperty } from './check-property';

export const prepareArgs = async (
  i: ActionDataInputWithValue,
  array: ActionDataInputWithValue[],
  abis: Record<Hex, AbiFunction[]>,
) => {
  switch (i.value) {
    case 'user_input': {
      switch (i.type) {
        case 'token_amount':
          return { ...i, preparedValue: parseUnits(i.inputtedValue ?? '0', i.decimals) };
        default:
          throw Error('Unknown input type');
      }
    }
    case 'method_result': {
      const abi = abis[i.to];
      console.log({ i, abis });

      if (!abi) throw new Error('ABI is not provided');

      const args = await Promise.all(
        i.method_params.map(async (param: unknown) => {
          if (checkProperty(param, 'input_id')) {
            const selected = array.find(j => j.id === (param as { input_id: number }).input_id)!;

            return await prepareArgs(selected, array, abis);
          }
          return param;
        }),
      );

      const result = (await readContract(wagmiConfig, {
        abi,
        address: i.to,
        functionName: i.method_name,
        args: args.map(i => {
          if (checkProperty(i, 'preparedValue'))
            return (i as { preparedValue: unknown }).preparedValue;

          return i;
        }),
      })) as unknown[];

      return {
        ...i,
        preparedValue: result[i.method_result],
      };
    }
    case undefined: {
      switch (i.type) {
        case 'deadline':
          return {
            ...i,
            preparedValue: Date.now() + 900000,
          };
        default:
          throw Error('Unknown input type');
      }
    }
    default:
      throw Error('Unknown value type');
  }
};
