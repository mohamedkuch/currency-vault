import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Currency } from '../currency';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.page.html',
  styleUrls: ['./currency-list.page.scss'],
})
export class CurrencyListPage implements OnInit, OnDestroy {
  currencies$: Observable<Currency[]>;
  selected: string = 'top';

  onDestroy$ = new ReplaySubject<void>(1);
  constructor(
    private mainService: MainService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currencies$ = this.mainService.currencies$;
  }
  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params) => {
        this.selected = params['selected'];
        console.log('Direction:', this.selected);
      });
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

    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
