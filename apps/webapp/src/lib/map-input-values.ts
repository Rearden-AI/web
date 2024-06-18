import { ActionDataInput, ActionDataUserInput, UserInputObject, ValueSource } from '../types/chat';

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
