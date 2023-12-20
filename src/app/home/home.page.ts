import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { CurrencyRates } from '../currencyRate';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { Currency } from '../currency';
import { ThemeService } from '../theme.service';

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

  isDarkMode = true;

  constructor(
    private mainService: MainService,
    private themeService: ThemeService
  ) {
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
  }
  ngOnInit(): void {
    const isDark = this.themeService.getIsDarkMode() === 'true';
    this.initializeDarkTheme(isDark);
  }

  initializeDarkTheme(isDark: boolean) {
    this.isDarkMode = isDark;
    this.toggleDarkTheme(isDark);
  }

  toggleChange() {
    this.isDarkMode = !this.isDarkMode;
    this.toggleDarkTheme(this.isDarkMode);
    this.themeService.setDarkMode(this.isDarkMode);
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
