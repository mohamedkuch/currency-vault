import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Currency } from '../currency';
import {
  Observable,
  ReplaySubject,
  filter,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchbarInputEventDetail } from '@ionic/angular';
import { IonSearchbarCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.page.html',
  styleUrls: ['./currency-list.page.scss'],
})
export class CurrencyListPage implements OnInit, OnDestroy {
  currencies$: Observable<Currency[]>;
  searchedCurrencies$: Observable<Currency[]>;

  selected: string = 'top';
  searchTerm = '';

  onDestroy$ = new ReplaySubject<void>(1);
  constructor(
    private mainService: MainService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currencies$ = this.mainService.currencies$;
    this.mainService.setSearchTerm('');

    this.searchedCurrencies$ = this.mainService.searchTerm$.pipe(
      filter((s) => !!s && s > ''),
      switchMap((searchTerm) => {
        return this.mainService.flags$.pipe(
          map((f) => {
            return f.filter((f) => {
              return f.full_data
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            });
          }),
          map((flagsData) => {
            return this.mainService.searchCurrencyByFlag(
              this.mainService.getCurrencies(),
              flagsData
            );
          })
        );
      })
    );
  }
  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {
        this.selected = params['selected'];
        console.log('Direction:', this.selected);
      });

    this.clearSearch();
  }

  handleTopSelectedCurrency(selectedCurrency: Currency): void {
    const currentTopSelected = this.mainService.getTopCurrency();
    const currentBottomSelected = this.mainService.getBottomCurrency();

    if (!currentTopSelected || !currentBottomSelected) {
      return;
    }

    if (currentBottomSelected?.id === selectedCurrency.id) {
      this.mainService.setBottomCurrency(currentTopSelected);
    }
    this.mainService.setTopCurrency(selectedCurrency);
  }

  handleBottomSelectedCurrency(selectedCurrency: Currency): void {
    const currentTopSelected = this.mainService.getTopCurrency();
    const currentBottomSelected = this.mainService.getBottomCurrency();

    if (!currentTopSelected || !currentBottomSelected) {
      return;
    }

    if (currentTopSelected?.id === selectedCurrency.id) {
      this.mainService.setTopCurrency(currentBottomSelected);
    }
    this.mainService.setBottomCurrency(selectedCurrency);
  }

  selectCurrency(selectedCurrency: Currency): void {
    if (this.selected === 'top') {
      this.handleTopSelectedCurrency(selectedCurrency);
    } else {
      this.handleBottomSelectedCurrency(selectedCurrency);
    }
    this.clearSearch();
    this.router.navigate(['/home']);
  }

  clearSearch() {
    this.searchTerm = '';
    this.mainService.setSearchTerm('');
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleSearch(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    if (event.target.value) {
      const searchTerm = event.target.value.toLowerCase();
      if (searchTerm > '') {
        this.mainService.setSearchTerm(searchTerm);
      }
    }
  }
}
