import { Component } from '@angular/core';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-bottom-container',
  templateUrl: './bottom-container.component.html',
  styleUrls: ['./bottom-container.component.scss'],
})
export class BottomContainerComponent {
  buttons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'delete'];

  constructor(private mainService: MainService) {}

  onSwitchClick() {
    const currentTopSelected = this.mainService.getTopCurrency();
    const currentBottomSelected = this.mainService.getBottomCurrency();

    if (!currentTopSelected || !currentBottomSelected) {
      return;
    }

    this.mainService.setTopCurrency(currentBottomSelected);
    this.mainService.setBottomCurrency(currentTopSelected);
  }

  onResetClick() {
    this.mainService.resetValues();
  }
}
