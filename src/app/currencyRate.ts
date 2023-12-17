export interface CurrencyRateItem {
  code: string;
  rate: number;
}

export interface CurrencyRates {
  date: string;
  base: string;
  rates: CurrencyRateItem[];
}
