import { Component, Input } from '@angular/core';
import { Currency } from 'src/app/currency';

@Component({
  selector: 'app-currency-item',
  templateUrl: './currency-item.component.html',
  styleUrls: ['./currency-item.component.scss'],
})
export class CurrencyItemComponent {
  @Input()
  currency!: Currency;
  constructor() {}
}
