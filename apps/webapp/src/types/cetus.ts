export interface CetusPrice {
  base_symbol: string;
  price: string;
  quote_symbol: string;
}

export interface CetusPriceResponse {
  code: number;
  msg: string;
  data: {
    time: Date;
    prices: CetusPrice[];
  };
}
