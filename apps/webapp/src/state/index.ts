import { enableMapSet } from 'immer';
import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { ChatsSlice, createChatsSlice } from './chats';
import { AccountsSlice, createAccountsSlice } from './accounts';
import { createPricesSlice, PricesSlice } from './prices';

/**
 * Required to enable use of `Map`s in Zustand state when using Immer
 * middleware. Without this, calling `.set()` on a `Map` in Zustand state
 * results in an error.
 */
enableMapSet();

export interface AllSlices {
  chats: ChatsSlice;
  accounts: AccountsSlice;
  prices: PricesSlice;
}

export type SliceCreator<SliceInterface> = StateCreator<
  AllSlices,
  [['zustand/immer', never]],
  [],
  SliceInterface
>;

export const initializeStore = () => {
  return immer((setState, getState: () => AllSlices, store) => ({
    chats: createChatsSlice()(setState, getState, store),
    accounts: createAccountsSlice()(setState, getState, store),
    prices: createPricesSlice()(setState, getState, store),
  }));
};

export const useStore = create<AllSlices>()(initializeStore());
