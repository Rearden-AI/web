import { Abi, AbiParameter, AbiStateMutability, Hex } from 'viem';
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
  TRANSACTION = 'transaction',
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
  SWAP = 'swap',
  ADD_LIQUIDITY = 'add Liquidity',
  ZKLOGIN = 'zkLogin',
}

export enum ChatSchemaState {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export interface ActionDetails {
  apy: string;
  dapp_link: string;
  name: string;
  from?: string | string[];
  to?: string;
  network?: SupportNework;
  token_address_in: null | Hex;
  token_address_out?: Hex;
}

export interface ActionBody {
  contract_address: Hex;
  token_address_in: Hex | null;
  token_address_out: Hex | null;
  arguments: {
    name: string;
    value?: string;
  }[];
  abi: AbiFunction;
  // add for swap
  withdraw_mode?: string;
  token_in?: Hex;
  callback_data?: Hex;
  amount_out_min?: bigint;
  deadline?: bigint;
  pool_address?: Hex;
}

export interface Action {
  action_type: ActionType;
  details: ActionDetails;
  body: ActionBody;
}

export interface ChatResponse {
  body: string;
  strategies?: Action[];
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
  strategies?: Action[];
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
  chain: 'eth';
  description: string;
  transaction_data: {
    to: Hex;
    method_name: string;
    method_parameters: unknown[];
    value: {
      input_id: number;
    };
  };
  abis: Record<Hex, Abi>;
  inputs: ActionDataInput[];
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
  method_parameters: unknown[];
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
