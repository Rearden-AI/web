import { readContract } from '@wagmi/core';
import { Hex, parseUnits } from 'viem';
import { wagmiConfig } from '../../../../wagmi';
import { AbiFunction, ActionDataInputWithValue } from '../types/chat';

export const objectIncludeKey = (obj: unknown, key: string) => {
  return obj instanceof Object && obj.hasOwnProperty(key);
};

export const getParamValue = async (
  i: ActionDataInputWithValue,
  array: ActionDataInputWithValue[],
  abis: Record<Hex, AbiFunction[]>,
) => {
  switch (i.value) {
    case 'user_input': {
      const input = i;
      switch (i.type) {
        case 'token_amount':
          return { ...i, preparedValue: parseUnits(input.inputtedValue ?? '0', input.decimals) };
        default:
          throw Error('Unknown input type');
      }
    }
    case 'method_result': {
      const input = i;
      const abi = abis[input.to];
      if (!abi) throw new Error('ABI is not provided');

      const args = await Promise.all(
        input.method_parameters.map(async (param: unknown) => {
          if (objectIncludeKey(param, 'input_id')) {
            const selected = array.find(j => j.id === (param as { input_id: number }).input_id)!;
            return await getParamValue(selected, array, abis);
          }
          return param;
        }),
      );

      const result = (await readContract(wagmiConfig, {
        abi,
        address: input.to,
        functionName: input.method_name,
        args: args.map(i => {
          if (objectIncludeKey(i, 'preparedValue'))
            return (i as { preparedValue: unknown }).preparedValue;

          return i;
        }),
      })) as unknown[];

      return {
        ...i,
        preparedValue: result[input.method_result] as unknown,
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
