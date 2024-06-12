import { InputElement } from '@rearden/ui/components/input';
import { Button } from '@rearden/ui/components/ui/button';
import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { Abi } from 'viem';
import { wagmiConfig } from '../../../config/wagmi';
import { checkProperty } from '../../../lib/check-property';
import { prepareArgs } from '../../../lib/prepare-args';
import { ActionData, ActionDataInputWithValue, TokenAmount } from '../../../types/chat';

export const ActionDataChain = ({ actionData }: { actionData: ActionData }) => {
  const [values, setValues] = useState<ActionDataInputWithValue[]>([]);

  useEffect(() => {
    setValues(
      actionData.inputs.map(i => ({
        ...i,
        inputtedValue: i.value === 'user_input' ? '0.0001' : undefined,
      })),
    );
  }, [actionData.inputs]);

  const handleClick = () => {
    void (async () => {
      try {
        const dynamicParams = await Promise.all(
          values.map(async (i, _, array) => await prepareArgs(i, array, actionData.abis)),
        );

        const functionParams = actionData.transaction_data.method_parameters.map(param => {
          if (checkProperty(param, 'input_id')) {
            const inputId = (param as { input_id: number }).input_id;
            return dynamicParams.find(i => i.id === inputId)?.preparedValue;
          }
          return param;
        });

        const abi = actionData.abis[actionData.transaction_data.to] as Abi;

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
      } catch (error) {
        //
      }
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
