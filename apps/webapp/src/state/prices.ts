import { AllSlices, SliceCreator } from '.';
import { CetusPrice } from '../types/cetus';

export interface PricesSlice {
  all: CetusPrice[];
  setPrices: (prices: CetusPrice[]) => void;
}

export const createPricesSlice = (): SliceCreator<PricesSlice> => set => {
  return {
    all: [],
    setPrices: prices => {
      set(state => {
        state.prices.all = prices;
      });
    },
  };
};

export const pricesSelector = (state: AllSlices) => state.prices;
