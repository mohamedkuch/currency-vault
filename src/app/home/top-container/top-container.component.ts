import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Currency } from 'src/app/currency';
import { Flag } from 'src/app/flag';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-top-container',
  templateUrl: './top-container.component.html',
  styleUrls: ['./top-container.component.scss'],
})
export class TopContainerComponent {
  selectedBottomCurrency$ = new Observable<Currency | undefined>();
  selectedTopCurrency$ = new Observable<Currency | undefined>();

  selectedTopValue$ = new Observable<string>();
  selectedBottomValue$ = new Observable<number>();

  constructor(private mainService: MainService) {
    this.selectedTopCurrency$ = this.mainService.selectedTopCurrency$;
    this.selectedBottomCurrency$ = this.mainService.selectedBottomCurrency$;

    this.selectedTopValue$ = this.mainService.selectedTopValue$;
    this.selectedBottomValue$ = this.mainService.selectedBottomValue$;
  }
}
