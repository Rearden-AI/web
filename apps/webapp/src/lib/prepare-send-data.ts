import { readContract } from '@wagmi/core';
import { Abi, Hex, encodeFunctionData, parseUnits } from 'viem';
import { wagmiConfig } from '../config/wagmi';
import {
  AbiFunction,
  ActionDataInput,
  ActionDataUserInput,
  InputId,
  PreparedParamValue,
  TransactionData,
  UserInputObject,
  UserInputValueType,
  ValueSource,
} from '../types/chat';
import { checkProperty } from './check-property';

export const mapInputValues = (
  inputs: ActionDataInput[],
  returnValues: UserInputObject,
): ActionDataUserInput[] => {
  return inputs.map(i => {
    switch (i.value_source) {
      case ValueSource.USER_INPUT:
        return {
          ...i,
          value: i.value ? `${i.value}` : '',
        };
      case ValueSource.ACTION_RESULT:
        const valueByActionId = returnValues[i.action_id];
        const valueByReturnId = valueByActionId![i.return_id];

        if (valueByReturnId) {
          return {
            ...valueByReturnId,
            description: i.description,
            id: i.id,
          };
        }
        throw new Error('Value by return id is not set');
      default:
        return i;
    }
  });
};

export const prepareParams = async (
  i: ActionDataUserInput,
  array: ActionDataUserInput[],
  abis?: Record<Hex, AbiFunction[] | string>,
): Promise<PreparedParamValue> => {
  switch (i.value_source) {
    case ValueSource.USER_INPUT: {
      switch (i.type) {
        case UserInputValueType.ADDRESS: {
          return { id: i.id, value: i.value };
        }
        case UserInputValueType.AMOUNT:
          return { id: i.id, value: parseUnits(i.value ?? '0', i.decimals) };
        default:
          throw Error('Unknown input type');
      }
    }
    case ValueSource.METHOD_RESULT: {
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
          if (checkProperty(i, 'value')) return (i as { value: unknown }).value;

          return i;
        }),
      })) as unknown[];

      return {
        id: i.id,
        value: result[i.method_result],
      };
    }
    case ValueSource.DEADLINE: {
      return {
        id: i.id,
        value: Date.now() + 900000,
      };
    }
    case ValueSource.ACTION_RESULT: {
      return { id: i.id, value: (await prepareParams(i.input, array)).value };
    }
    default:
      throw Error('Unknown value type');
  }
};

export function getValueFromDynamicParams<T>(
  value: T | InputId,
  dynamicParams: PreparedParamValue[],
): T {
  if (checkProperty<InputId>(value, 'input_id'))
    return dynamicParams.find(i => i.id === value.input_id)?.value as T;

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
  preparedParams: PreparedParamValue[],
) => {
  const sortedParams = transactionData.method_params
    ? transactionData.method_params.map(param =>
        getValueFromDynamicParams<unknown>(param, preparedParams),
      )
    : [];

  const to = getValueFromDynamicParams<Hex>(transactionData.to, preparedParams);

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
    : getValueFromDynamicParams<string | bigint>(transactionData.value, preparedParams);

  return {
    to,
    value: !value ? undefined : typeof value === 'string' ? BigInt(value) : value,
    data,
  };
};
