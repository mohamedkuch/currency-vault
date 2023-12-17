import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map } from 'rxjs';
import { Currency } from './currency';
import { CurrencyFlag, Flag } from './flag';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private flagsURL = 'https://restcountries.com/v3.1/all';
  private currencybeaconURL = 'https://api.currencybeacon.com/v1/';
  private API_KEY = 'tNCfFyrM0vdAGMZHrE33yTFmSXuWfPRz';

  private currenciesSource = new BehaviorSubject<Currency[]>([]);
  readonly currencies$ = this.currenciesSource.asObservable();

  private selectedTopCurrencySource = new BehaviorSubject<Currency | undefined>(
    undefined
  );
  private selectedBottomCurrencySource = new BehaviorSubject<
    Currency | undefined
  >(undefined);
  readonly selectedTopCurrency$ = this.selectedTopCurrencySource.asObservable();
  readonly selectedBottomCurrency$ =
    this.selectedBottomCurrencySource.asObservable();

  public priorityCountries = {
    USD: 'US', // United States for US Dollar
    EUR: 'DE', // Germany for Euro
    XCD: 'AG', // Antigua and Barbuda for East Caribbean Dollar
    XOF: 'SN', // Senegal for West African CFA Franc
    XAF: 'CM', // Cameroon for Central African CFA Franc
    XPF: 'PF', // French Polynesia for CFP Franc
    AUD: 'AU', // Australia for Australian Dollar
    GBP: 'GB', // United Kingdom for British Pound Sterling
  };

  constructor(private http: HttpClient) {}

  fetchData(onComplete: () => void): void {
    const currencyRequest = this.fetchCurrency();
    const flagsRequest = this.fetchFlags();

    forkJoin([currencyRequest, flagsRequest]).subscribe({
      next: ([currencyData, flagsData]) => {
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
      let flagsArray = flagData.filter((flag) =>
        flag.currencies.find((c) => c.code === currency.short_code)
      );
      final.flags = flagsArray;
      return final;
    });
  }

  setTopCurrency(currency: Currency): void {
    this.selectedTopCurrencySource.next(currency);
  }

  getTopCurrency(): Currency | undefined {
    return this.selectedTopCurrencySource.getValue();
  }

  getBottomCurrency(): Currency | undefined {
    return this.selectedBottomCurrencySource.getValue();
  }

  setBottomCurrency(currency: Currency): void {
    this.selectedBottomCurrencySource.next(currency);
  }

  private setSelectedCurrencies(currencyData: Currency[]): void {
    this.selectedTopCurrencySource.next(
      currencyData.find((c) => c.short_code === 'USD')
    );
    this.selectedBottomCurrencySource.next(
      currencyData.find((c) => c.short_code === 'EUR')
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
            return new Flag(
              flagData.name.official,
              flagData.flags.png.replace('w320', '192x144'),
              flagData.cca2,
              flagData.ccn3,
              currencyFlags
            );
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
                []
              );
            });
            return currencies;
          }
          return [];
        })
      );
  }
}
