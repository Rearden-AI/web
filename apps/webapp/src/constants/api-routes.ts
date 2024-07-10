export const API_ID = '{id}';

export enum ApiRoutes {
  AUTH = '/auth',
  REFRESH = '/auth/refresh',
  CHALLENGE = '/auth/challenge',
  CHATS = '/chats',
  CHAT_BY_ID = '/chats/{id}',
  CHAT_BY_ID_DEMO = '/chats/{id}/demo',
  STRATEGY_EXECUTIONS = '/strategy_executions',
  TRANSACTIONS = '/transactions',
  TRANSACTIONS_BY_ID = '/transactions/{id}',
  NONCE = '/auth/nonce',
  VERIFY = '/auth/verify',
  LOGOUT = '/auth/logout',
  ME = '/auth/me',
}
