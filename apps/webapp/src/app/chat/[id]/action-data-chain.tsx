import { InputElement } from '@rearden/ui/components/input';
import { ActionData, ActionDataInput, TokenAmount } from '../../../types/chat';
import { useEffect, useState } from 'react';
import { Button } from '@rearden/ui/components/ui/button';
import { Abi, Hex, parseUnits } from 'viem';
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { wagmiConfig } from '../../../lib/wagmi';

const objectIncludeKey = (obj: unknown, key: string) => {
  return obj instanceof Object && obj.hasOwnProperty(key);
};

const getParamValue = async (
  i: ActionDataInput,
  array: ActionDataInput[],
  abis: Record<Hex, Abi>,
) => {
  switch (i.value) {
    case 'user_input': {
      const input = i as unknown as TokenAmount & { inputtedValue: string };
      switch (i.type) {
        case 'token_amount':
          return { ...i, preparedValue: parseUnits(input.inputtedValue, input.decimals) };
        default:
          throw Error('Unknown input type');
      }
    }
    case 'method_result': {
      const input = i;
      const abi = abis[input.to];
      if (!abi) throw new Error('ABI is not provided');
      //TODO get abi by contract address

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
          if (objectIncludeKey(i, 'preparedValue')) {
            return (i as { preparedValue: unknown }).preparedValue;
          }
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

export const ActionDataChain = ({ actionData }: { actionData: ActionData }) => {
  const [values, setValues] = useState<({ inputtedValue?: string } & ActionDataInput)[]>([]);

  useEffect(() => {
    setValues(
      actionData.inputs.map(i => ({
        ...i,
        inputtedValue: i.value === 'user_input' ? '1' : undefined,
      })),
    );
  }, []);

  const handleClick = () => {
    void (async () => {
      try {
        const dynamicParams = await Promise.all(
          values.map(async (i, _, array) => await getParamValue(i, array, actionData.abis)),
        );

        const functionParams = actionData.transaction_data.method_parameters.map(param => {
          if (objectIncludeKey(param, 'input_id')) {
            const inputId = (param as { input_id: number }).input_id;
            return dynamicParams.find(i => i.id === inputId)?.preparedValue;
          }
          return param;
        });

        const abi = actionData.abis[actionData.transaction_data.to];

        if (!abi) throw new Error('ABI is not provided');
        //TODO get abi by contract address

        const paramValue = dynamicParams.find(
          i => i.id === actionData.transaction_data.value.input_id,
        );

        const value = paramValue ? (paramValue.preparedValue as bigint) : undefined;

        const transactionHash = await writeContract(wagmiConfig, {
          abi,
          address: actionData.transaction_data.to,
          functionName: actionData.transaction_data.method_name,
          args: functionParams,
          value,
        });

        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          hash: transactionHash,
        });
        console.log({ receipt });
      } catch (error) {}
    })();
  };

  return (
    <div className='flex flex-col gap-2'>
      {values.map((i, index) => {
        if (i.value !== 'user_input') return null;
        const a = i as unknown as TokenAmount;

        return (
          <InputElement
            key={index}
            label={a.description}
            placeholder={a.description}
            type='number'
            value={i.inputtedValue}
            onChange={e => {
              const newArray = [...values];
              const currentObj = newArray[index]!;

              currentObj.inputtedValue = e.target.value;

              newArray[index] = currentObj;
              setValues(newArray);
            }}
          />
        );
      })}
      <Button onClick={handleClick}>Send</Button>
    </div>
  );
};
