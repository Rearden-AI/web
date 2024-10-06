import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { AllSlices, SliceCreator } from '.'

export interface AuthSlice {
  isAuth?: boolean;
  status: AuthenticationStatus;
  setStatus: (status: AuthenticationStatus) => void;
  setAuth: (isAuth: boolean) => void;
}

export const createAuthSlice = (): SliceCreator<AuthSlice> => set => {
  return {
    status: 'unauthenticated',
    setStatus: status => {
      set(state => {
        state.auth.status = status;
      });
    },
    setAuth: isAuth => {
      set(state => {
        state.auth.isAuth = isAuth;
      });
    },
  };
};

export const authSelector = (state: AllSlices) => state.auth;
