import { Hex } from 'viem';
import { ActionType } from './chat';

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  WAITING = 'waiting',
}

export interface TransactionResult {
  action_name: string;
  amount: string;
  chat_uuid: string;
  from_address: Hex;
  id: number;
  network: number;
  status: TransactionStatus;
  timestamp: number;
  to_address: Hex;
  token_symbol: string;
  transaction_hash: string;
  transaction_type: ActionType;
}
