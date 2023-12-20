export interface CurrencyFlag {
  code: string;
  name: string;
  symbol: string;
}

export class Flag {
  name: string;
  flag_url: string;
  cca2: string;
  ccn3: string;
  currencies: CurrencyFlag[];
  full_data: string;

  constructor(
    name: string,
    flag_url: string,
    cca2: string,
    ccn3: string,
    currencies: CurrencyFlag[],
    full_data: string
  ) {
    this.name = name;
    this.flag_url = flag_url;
    this.cca2 = cca2;
    this.ccn3 = ccn3;
    this.currencies = currencies;
    this.full_data = full_data;
  }
}
