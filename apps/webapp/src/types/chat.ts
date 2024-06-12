import { AbiParameter, AbiStateMutability, Hex } from 'viem';
import { TransactionResult } from './transactions';

export interface AbiFunction {
  type: 'function';
  constant?: boolean | undefined;
  gas?: number | undefined;
  inputs: AbiParameter[];
  name: string;
  outputs: AbiParameter[];
  payable?: boolean | undefined;
  stateMutability: AbiStateMutability;
}

export type SupportNework = 1 | 324 | 17000;

export enum ActionType {
  SWAP = 'Swap',
}

export enum ChatSchemaState {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export interface ChatResponse {
  body: string;
  contains_strategy_previews?: string[];
  exec_logs?: string;
  timestamp: number;
  action_data: ActionData;
}

export interface ChatSchema {
  name: string | null;
  uuid: string;
  created_at: Date;
  state: ChatSchemaState;
  user_id: number;
}

export interface HistoryMessage {
  role: Role;
  content?: string;
  contains_strategy_previews?: string[];
  transactions?: TransactionResult[];
  timestamp: number;
  action_data?: ActionData;
}

export interface ExtendedChatSchema extends ChatSchema {
  history: HistoryMessage[];
}

export enum Role {
  USER = 'user',
  SYSTEM = 'system',
  MODEL = 'model',
}

export interface SelectedChat extends ExtendedChatSchema {
  isNew?: boolean;
}

export interface ActionData {
  application_data: {
    contract_address: Hex;
    contract_address_on_explorer: string;
    name: string;
    url: string;
  };
  network: {
    icon: string | null;
    name: string;
    chain: { type: string; chainId: SupportNework };
  };
  description: string;
  transaction_data: {
    to: Hex;
    method_name: string;
    method_params: unknown[];
    value: {
      input_id: number;
    };
    inputs: ActionDataInput[];
    abis: Record<Hex, AbiFunction[]>;
  };
  type: ActionType;
  balance_data: { coin: 'native' | Hex; symbol: string };
  parameters_description: {
    icon: string | null;
    name: string;
    value: string;
  }[];
}

export interface TokenAmount {
  id: number;
  value: 'user_input';
  description: string;
  type: 'token_amount';
  decimals: number;
}

export interface MethodResult {
  id: number;
  value: 'method_result';
  type: 'amount';
  to: Hex;
  method_name: string;
  method_params: unknown[];
  method_result: number;
}

export type ActionDataInput =
  | TokenAmount
  | MethodResult
  | {
      id: number;
      type: 'deadline';
      value: undefined;
    };

export type ActionDataInputWithValue = ActionDataInput & {
  inputtedValue?: string;
};
