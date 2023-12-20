import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, forkJoin, map } from 'rxjs';
import { Currency } from './currency';
import { CurrencyFlag, Flag } from './flag';
import { CurrencyRates } from './currencyRate';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private flagsURL = 'https://restcountries.com/v3.1/all';
  private currencybeaconURL = 'https://api.currencybeacon.com/v1/';
  private API_KEY = 'tNCfFyrM0vdAGMZHrE33yTFmSXuWfPRz';

  private currencyRateSource = new BehaviorSubject<CurrencyRates | undefined>(
    undefined
  );
  readonly currencyRate$ = this.currencyRateSource.asObservable();

  private currenciesSource = new BehaviorSubject<Currency[]>([]);
  readonly currencies$ = this.currenciesSource.asObservable();

  private flagsSource = new BehaviorSubject<Flag[]>([]);
  readonly flags$ = this.flagsSource.asObservable();

  private selectedTopCurrencySource = new BehaviorSubject<Currency | undefined>(
    undefined
  );
  private selectedBottomCurrencySource = new BehaviorSubject<
    Currency | undefined
  >(undefined);
  readonly selectedTopCurrency$ = this.selectedTopCurrencySource.asObservable();
  readonly selectedBottomCurrency$ =
    this.selectedBottomCurrencySource.asObservable();

  private selectedTopValue = new BehaviorSubject<string>('1');
  private selectedBottomValue = new BehaviorSubject<number>(0);

  readonly selectedTopValue$ = this.selectedTopValue.asObservable();
  readonly selectedBottomValue$ = this.selectedBottomValue.asObservable();

  private searchTermSource = new BehaviorSubject<string>('');
  readonly searchTerm$ = this.searchTermSource.asObservable();

  public priorityCountries: { [key: string]: string } = {
    USD: 'US', // United States for US Dollar
    EUR: 'DE', // Germany for Euro
    XCD: 'AG', // Antigua and Barbuda for East Caribbean Dollar
    XOF: 'SN', // Senegal for West African CFA Franc
    XAF: 'CM', // Cameroon for Central African CFA Franc
    XPF: 'PF', // French Polynesia for CFP Franc
    AUD: 'AU', // Australia for Australian Dollar
    GBP: 'GB', // United Kingdom for British Pound Sterling
    HRK: 'HR',
    LTL: 'LT',
    LVL: 'LV',
    MRO: 'MR',
    STD: 'ST',
    SVC: 'SV',
    VEF: 'VE',
    CLF: 'CL',
    BOV: 'BO',
  };

  constructor(private http: HttpClient) {}

  fetchData(onComplete: () => void): void {
    const currencyRequest = this.fetchCurrency();
    const flagsRequest = this.fetchFlags();
    const rateRequest = this.fetchRate();

    forkJoin([currencyRequest, flagsRequest, rateRequest]).subscribe({
      next: ([currencyData, flagsData, rateData]) => {
        this.currencyRateSource.next(rateData);
        this.flagsSource.next(flagsData);
        let final_Currency = this.processData(currencyData, flagsData);
        this.currenciesSource.next(final_Currency);
        this.setSelectedCurrencies(final_Currency);
        onComplete();
      },
      error: (err) => {
        console.error('Error loading data', err);
        onComplete();
      },
    });
  }

  processData(currencyData: Currency[], flagData: Flag[]): Currency[] {
    return currencyData.map((currency) => {
      let final = currency;

      let flagsArray: Flag[] = [];

      // Check if the currency has a priority country
      const priorityCountryCode = this.priorityCountries[currency.short_code];
      if (
        priorityCountryCode &&
        this.priorityCountries.hasOwnProperty(currency.short_code)
      ) {
        // Find the flag for the priority country
        const priorityFlag = flagData.find(
          (flag) => flag.cca2 === priorityCountryCode
        );
        if (priorityFlag) {
          flagsArray.push(priorityFlag);
        }
      } else {
        // If no priority country, use the regular method to find flags
        flagsArray = flagData.filter((flag) => {
          return flag.currencies.find((c) => c.code === currency.short_code);
        });
      }

      final.flags = flagsArray;
      return final;
    });
  }

  searchCurrencyByFlag(currencyData: Currency[], flagData: Flag[]): Currency[] {
    return currencyData.filter((currency) => {
      return flagData.find((flag) =>
        flag.currencies.find((f) => f.code === currency.short_code)
      );
    });
  }

  resetValues(): void {
    this.selectedTopValue.next('0');
    this.selectedBottomValue.next(0);
  }

  setTopCurrency(currency: Currency): void {
    this.selectedTopCurrencySource.next(currency);
    this.calculateBottomValue();
  }

  getTopCurrency(): Currency | undefined {
    return this.selectedTopCurrencySource.getValue();
  }

  getBottomCurrency(): Currency | undefined {
    return this.selectedBottomCurrencySource.getValue();
  }

  setBottomCurrency(currency: Currency): void {
    this.selectedBottomCurrencySource.next(currency);
    this.calculateBottomValue();
  }

  setTopValue(value: string): void {
    this.selectedTopValue.next(value);
    this.calculateBottomValue();
  }

  getTopValue(): string {
    return this.selectedTopValue.getValue();
  }

  setSearchTerm(term: string): void {
    this.searchTermSource.next(term);
  }

  getCurrencies(): Currency[] {
    return this.currenciesSource.getValue();
  }

  private setSelectedCurrencies(currencyData: Currency[]): void {
    this.selectedTopCurrencySource.next(
      currencyData.find((c) => c.short_code === 'USD')
    );
    this.selectedBottomCurrencySource.next(
      currencyData.find((c) => c.short_code === 'EUR')
    );
    this.calculateBottomValue();
  }

  calculateBottomValue() {
    const rate = this.currencyRateSource.getValue();

    const currentTopCurrency = this.selectedTopCurrencySource.getValue();
    const currentBottomCurrency = this.selectedBottomCurrencySource.getValue();
    const currentTopValue = +this.selectedTopValue.getValue();

    const topRate = rate?.rates
      .filter((r) => r.code === currentTopCurrency?.short_code)
      .filter((r) => !!r)
      .map((r) => r.rate);

    const bottomRate = rate?.rates
      .filter((r) => r.code === currentBottomCurrency?.short_code)
      .filter((r) => !!r)
      .map((r) => r.rate);

    if (currentTopValue === 0) {
      this.selectedBottomValue.next(0);
    }

    if (
      currentBottomCurrency &&
      currentTopCurrency &&
      topRate &&
      topRate.length === 1 &&
      bottomRate &&
      bottomRate.length === 1
    ) {
      this.selectedBottomValue.next(
        +((1 / topRate[0]) * bottomRate[0] * currentTopValue).toFixed(2)
      );
    }
  }

  fetchRate(): Observable<CurrencyRates> {
    const url = `${this.currencybeaconURL}latest?api_key=${this.API_KEY}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const rates = Object.entries(response.response.rates).map(
          ([code, rate]) => ({
            code,
            rate: Number(rate),
          })
        );
        return {
          date: response.response.date,
          base: response.response.base,
          rates: rates,
        };
      })
    );
  }

  fetchFlags(): Observable<Flag[]> {
    return this.http.get<any[]>(this.flagsURL, { observe: 'response' }).pipe(
      map((response) => {
        if (response.body) {
          const flags = response.body.map((flagData) => {
            let currencyFlags: CurrencyFlag[] = [];
            if (flagData.currencies) {
              currencyFlags = Object.keys(flagData['currencies']).map(
                (currencyCode) => {
                  return {
                    code: currencyCode,
                    name: flagData.currencies[currencyCode].name,
                    symbol: flagData.currencies[currencyCode].symbol,
                  };
                }
              );
            }

            const result = new Flag(
              flagData.name.official,
              flagData.flags.png.replace('w320', '192x144'),
              flagData.cca2,
              flagData.ccn3,
              currencyFlags,
              JSON.stringify(flagData)
            );

            return result;
          });
          return flags;
        }
        return [];
      })
    );
  }

  fetchCurrency(): Observable<Currency[]> {
    const url = `${this.currencybeaconURL}currencies?api_key=${this.API_KEY}`;
    return this.http
      .get<{ meta: {}; response: [] }>(url, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response.body?.response) {
            const currencies = response.body.response.map((currencyData) => {
              return new Currency(
                currencyData['id'],
                currencyData['code'],
                currencyData['name'],
                currencyData['short_code'],
                [],
                currencyData['symbol']
              );
            });
            return currencies;
          }
          return [];
        })
      );
  }
}
