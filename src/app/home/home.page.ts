import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { CurrencyRates } from '../currencyRate';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { Currency } from '../currency';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currencyRate$: Observable<CurrencyRates | undefined>;
  selectedTopCurrency$: Observable<Currency | undefined>;
  selectedBottomCurrency$: Observable<Currency | undefined>;

  selectedRate$: Observable<string>;

  themeToggle = false;

  constructor(private mainService: MainService) {
    this.currencyRate$ = this.mainService.currencyRate$;
    this.selectedTopCurrency$ = this.mainService.selectedTopCurrency$;
    this.selectedBottomCurrency$ = this.mainService.selectedBottomCurrency$;

    this.selectedRate$ = combineLatest([
      this.currencyRate$,
      this.selectedBottomCurrency$,
      this.selectedTopCurrency$,
    ]).pipe(
      map(([rate, currentBottomCurrency, currentTopCurrency]) => {
        if (rate && currentBottomCurrency && currentTopCurrency) {
          const topRate = rate?.rates
            .filter((r) => r.code === currentTopCurrency?.short_code)
            .filter((r) => !!r)
            .map((r) => r.rate);

          const bottomRate = rate?.rates
            .filter((r) => r.code === currentBottomCurrency?.short_code)
            .filter((r) => !!r)
            .map((r) => r.rate);

          const bottomResult = +((1 / topRate[0]) * bottomRate[0]).toFixed(2);

          return `1 ${currentTopCurrency.short_code} = ${bottomResult} ${currentBottomCurrency.short_code} `;
        }

        return '';
      })
    );
    this.currencyRate$.subscribe((data) => {
      console.log('#### data', data);
    });
  }
  ngOnInit(): void {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) =>
      this.initializeDarkTheme(mediaQuery.matches)
    );
  }

  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  toggleChange() {
    this.themeToggle = !this.themeToggle;
    console.log('##### this.themeToggle', this.themeToggle);
    this.toggleDarkTheme(this.themeToggle);
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
