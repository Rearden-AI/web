import { AllSlices, SliceCreator } from '.';

export interface AccountsSlice {
  selectedAccount?: string;
  setAccount: (account: string) => void;
}

export const createAccountsSlice = (): SliceCreator<AccountsSlice> => set => {
  return {
    setAccount: account => {
      set(state => {
        state.accounts.selectedAccount = account;
      });
    },
  };
};

export const accountsSelector = (state: AllSlices) => state.accounts;
