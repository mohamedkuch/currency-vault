import { Component } from '@angular/core';
import { MainService } from '../main.service';
import { Currency } from '../currency';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.page.html',
  styleUrls: ['./currency-list.page.scss'],
})
export class CurrencyListPage {
  currencies$: Observable<Currency[]>;
  constructor(private mainService: MainService) {
    this.currencies$ = this.mainService.currencies$;
  }
}
