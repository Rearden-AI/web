import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { AllSlices, SliceCreator } from '.';

export interface AuthSlice {
  status: AuthenticationStatus;
  setStatus: (status: AuthenticationStatus) => void;
}

export const createAuthSlice = (): SliceCreator<AuthSlice> => set => {
  return {
    status: 'loading',
    setStatus: status => {
      set(state => {
        state.auth.status = status;
      });
    },
  };
};

export const authSelector = (state: AllSlices) => state.auth;
