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
  TRANSFER = 'Transfer',
  DEPOSIT = 'Deposit',
  APPROVE = 'Approve',
}

export enum ChatSchemaState {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export interface Action {
  action_data: ActionData;
  id: number;
}

export interface ChooseableAction {
  approxApy: number;
  key: string;
  name: string;
}

export interface ChatResponse {
  body: string;
  exec_logs?: string;
  timestamp: number;
  actions: Action[];
  chooseable_actions?: ChooseableAction[];
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
  transactions?: TransactionResult[];
  timestamp: number;
  actions?: Action[];
  chooseable_actions?: ChooseableAction[];
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

export interface ApplicationData {
  contract_address: Hex;
  contract_address_on_explorer: string;
  name: string;
  url: string;
}

export interface Network {
  icon: string | null;
  name: string;
  chain: { type: string; chainId: SupportNework };
}

export interface TransactionData {
  to: Hex | InputId;
  method_name?: string;
  method_params?: unknown[];
  value: InputId | string | null;
  inputs: ActionDataInput[];
  abis?: Record<Hex, AbiFunction[] | string>;
  returns?: { id: number; value: InputId }[];
}

export interface BalanceData {
  coin: 'native' | Hex;
  symbol: string;
}

export interface ParametersDescription {
  icon: string | null;
  name: string;
  value: string;
}

export interface ActionData {
  application_data?: ApplicationData;
  network: Network;
  description: string;
  transaction_data: TransactionData;
  type: ActionType;
  balance_data: BalanceData;
  parameters_description?: {
    icon: string | null;
    name: string;
    value: string;
  }[];
}

export enum UserInputValueType {
  ADDRESS = 'address',
  AMOUNT = 'amount',
}

export enum ValueSource {
  USER_INPUT = 'user_input',
  METHOD_RESULT = 'method_result',
  ACTION_RESULT = 'action_result',
  DEADLINE = 'deadline',
}

export interface UserInput {
  id: number;
  description: string;
  decimals: number;
  type: UserInputValueType;
  value_source: ValueSource.USER_INPUT;
  value?: string;
}

export interface MethodResult {
  id: number;
  method_name: string;
  method_result: number;
  method_params: unknown[];
  to: Hex;
  type: 'amount';
  value_source: ValueSource.METHOD_RESULT;
}

export interface ActionResult {
  action_id: number;
  description: string;
  id: number;
  return_id: number;
  value_source: ValueSource.ACTION_RESULT;
}

export type ActionDataInput =
  | UserInput
  | MethodResult
  | ActionResult
  | {
      id: number;
      value_source: ValueSource.DEADLINE;
    };

export interface InputId {
  input_id: number;
}

export type ActionDataUserInput =
  | UserInput
  | MethodResult
  | (ActionResult & { input: UserInput; value: string; type: UserInputValueType })
  | {
      id: number;
      value_source: ValueSource.DEADLINE;
    };

export type UserInputObject = Record<number, Record<number, UserInput>>;

export interface PreparedParamValue {
  id: number;
  value: unknown;
}
