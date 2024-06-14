import { readContract } from '@wagmi/core';
import { Abi, Hex, encodeFunctionData, parseUnits } from 'viem';
import { wagmiConfig } from '../config/wagmi';
import { AbiFunction, ActionDataInputWithValue, InputId, TransactionData } from '../types/chat';
import { checkProperty } from './check-property';

export const prepareParams = async (
  i: ActionDataInputWithValue,
  array: ActionDataInputWithValue[],
  abis?: Record<Hex, AbiFunction[] | string>,
): Promise<ActionDataInputWithValue & { preparedValue: unknown }> => {
  switch (i.value) {
    case 'user_input': {
      switch (i.type) {
        case 'token_amount':
          return { ...i, preparedValue: parseUnits(i.inputtedValue ?? '0', i.decimals) };
        case 'address':
          return { ...i, preparedValue: i.inputtedValue };
        case 'amount':
          return { ...i, preparedValue: parseUnits(i.inputtedValue ?? '0', i.decimals) };
        default:
          throw Error('Unknown input type');
      }
    }
    case 'method_result': {
      const abi = getContractAbi(i.to, abis);
      if (!abi) throw new Error(`ABI is not provided for ${i.to} contract`);

      const args = await Promise.all(
        i.method_params.map(async (param: unknown) => {
          if (checkProperty(param, 'input_id')) {
            const selected = array.find(j => j.id === (param as InputId).input_id)!;

            return await prepareParams(selected, array, abis);
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

export function getGenericValue<T>(
  value: T | InputId,
  dynamicParams: (ActionDataInputWithValue & { preparedValue: unknown })[],
): T {
  if (checkProperty<InputId>(value, 'input_id'))
    return dynamicParams.find(i => i.id === value.input_id)?.preparedValue as T;

  return value;
}

export const getContractAbi = (
  contract: Hex,
  abis?: Record<Hex, AbiFunction[] | string>,
): Abi | undefined => {
  if (!abis) return;

  const contractAbi = abis[contract];

  if (!contractAbi) return;

  const abi = typeof contractAbi === 'string' ? JSON.parse(contractAbi) : contractAbi;

  return abi;
};

export const getSendParams = (
  transactionData: TransactionData,
  preparedParams: (ActionDataInputWithValue & {
    preparedValue: unknown;
  })[],
) => {
  const sortedParams = transactionData.method_params.map(param =>
    getGenericValue<unknown>(param, preparedParams),
  );
  const to = getGenericValue<Hex>(transactionData.to, preparedParams);

  const abi = getContractAbi(to, transactionData.abis);

  const data =
    abi && transactionData.method_name
      ? encodeFunctionData({
          abi: abi,
          functionName: transactionData.method_name,
          args: sortedParams,
        })
      : undefined;

  const value = !transactionData.value
    ? undefined
    : getGenericValue<string | bigint>(transactionData.value, preparedParams);

  return {
    to,
    value: !value ? undefined : typeof value === 'string' ? BigInt(value) : value,
    data,
  };
};
