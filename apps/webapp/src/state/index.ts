import { enableMapSet } from 'immer';
import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ChatsSlice, createChatsSlice } from './chats';
import { AuthSlice, createAuthSlice } from './auth';

/**
 * Required to enable use of `Map`s in Zustand state when using Immer
 * middleware. Without this, calling `.set()` on a `Map` in Zustand state
 * results in an error.
 */
enableMapSet();

export interface AllSlices {
  chats: ChatsSlice;
  auth: AuthSlice;
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
    auth: createAuthSlice()(setState, getState, store),
  }));
};

export const useStore = create<AllSlices>()(initializeStore());
